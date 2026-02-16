import { Holistic } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION, HAND_CONNECTIONS, POSE_CONNECTIONS } from '@mediapipe/holistic';
import { loadGestureModel, loadLabelMap } from '../services/modelLoader';
import { classifyGesture } from '../services/gestureClassifier';
import { GestureDetectionOptimizer } from '../utils/performanceOptimizer';

export default function GestureDetector({ onGestureDetected, isActive }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const holisticRef = useRef(null);
    const modelRef = useRef(null);
    const labelMapRef = useRef(null);
    const optimizerRef = useRef(new GestureDetectionOptimizer());
    const [isLoading, setIsLoading] = useState(true);
    const [fps, setFps] = useState(0);

    useEffect(() => {
        let camera;
        let animationFrameId;
        let lastFrameTime = Date.now();
        let frameCount = 0;

        async function initializeDetection() {
            try {
                setIsLoading(true);

                // Load gesture classification model
                const model = await loadGestureModel();
                modelRef.current = model;

                // Load label map
                const labelMap = await loadLabelMap();
                labelMapRef.current = labelMap;

                if (!model || !labelMap) {
                    console.warn('Model not loaded, using simulated detection');
                }

                // Initialize MediaPipe Holistic
                const holistic = new Holistic({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
                    }
                });

                holistic.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    smoothSegmentation: false,
                    refineFaceLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                holistic.onResults(async (results) => {
                    if (!isActive) return;

                    // Update FPS counter
                    frameCount++;
                    const now = Date.now();
                    if (now - lastFrameTime >= 1000) {
                        setFps(frameCount);
                        frameCount = 0;
                        lastFrameTime = now;
                    }

                    // Draw landmarks on canvas
                    drawHolisticLandmarks(results);

                    // Check if should process this frame
                    if (!optimizerRef.current.shouldProcessFrame()) {
                        return;
                    }

                    // Classify gesture if hands or face detected
                    // We pass the whole results object to the classifier
                    if (results.rightHandLandmarks || results.leftHandLandmarks) {
                        try {
                            const result = await classifyGesture(
                                results, // Pass full holistic results
                                modelRef.current,
                                labelMapRef.current
                            );

                            if (result) {
                                // Add to buffer for smoothing
                                optimizerRef.current.addToBuffer(result.gesture, result.confidence);

                                // Get stable gesture
                                const stableGesture = optimizerRef.current.getStableGesture();

                                if (stableGesture && onGestureDetected) {
                                    optimizerRef.current.updateDetectionTime();
                                    onGestureDetected({
                                        gesture: stableGesture,
                                        confidence: result.confidence
                                    });
                                }
                            }
                        } catch (error) {
                            console.error('Gesture classification error:', error);
                        }
                    }
                });

                holisticRef.current = holistic;

                // Setup camera
                if (videoRef.current) {
                    camera = new Camera(videoRef.current, {
                        onFrame: async () => {
                            if (holisticRef.current && videoRef.current) {
                                await holisticRef.current.send({ image: videoRef.current });
                            }
                        },
                        width: 640,
                        height: 480
                    });

                    await camera.start();
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Failed to initialize gesture detection:', error);
                setIsLoading(false);
            }
        }

        if (isActive) {
            initializeDetection();
        }

        return () => {
            if (camera) {
                camera.stop();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (optimizerRef.current) {
                optimizerRef.current.reset();
            }
        };
    }, [isActive, onGestureDetected]);

    function drawHolisticLandmarks(results) {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Face Mesh
        drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });

        // Draw Pose
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
        drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 1, radius: 3 });

        // Draw Left Hand
        drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: '#CC0000', lineWidth: 2 });
        drawLandmarks(ctx, results.leftHandLandmarks, { color: '#00FF00', lineWidth: 1, radius: 3 });

        // Draw Right Hand
        drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: '#00CC00', lineWidth: 2 });
        drawLandmarks(ctx, results.rightHandLandmarks, { color: '#FF0000', lineWidth: 1, radius: 3 });
    }

    return (
        <div className="relative bg-black rounded-lg overflow-hidden shadow-lg" style={{ height: '400px' }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ transform: 'scaleX(-1)' }}
            />

            {/* FPS Counter */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm font-mono z-10">
                {fps} FPS
            </div>

            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <div className="text-white text-lg font-medium">Initializing Computer Vision...</div>
                    <div className="text-gray-400 text-sm mt-2">Loading MediaPipe Hands & TFJS Model</div>
                </div>
            )}

            {!isActive && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
                    <div className="text-white text-xl font-medium">Camera Inactive</div>
                </div>
            )}
        </div>
    );
}
