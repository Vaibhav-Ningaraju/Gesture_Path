export class GestureDetectionOptimizer {
    constructor() {
        this.lastDetectionTime = 0;
        this.detectionInterval = 1000; // 1 second between detections
        this.frameSkipCount = 0;
        this.frameSkipInterval = 2; // Process every 3rd frame
        this.confidenceThreshold = 0.7;
        this.gestureBuffer = [];
        this.bufferSize = 3;
    }

    shouldProcessFrame() {
        // Skip frames to reduce computational load
        this.frameSkipCount++;
        if (this.frameSkipCount < this.frameSkipInterval) {
            return false;
        }
        this.frameSkipCount = 0;

        // Check if enough time has passed since last detection
        const now = Date.now();
        if (now - this.lastDetectionTime < this.detectionInterval) {
            return false;
        }

        return true;
    }

    updateDetectionTime() {
        this.lastDetectionTime = Date.now();
    }

    addToBuffer(gesture, confidence) {
        // Add gesture to buffer for smoothing
        this.gestureBuffer.push({ gesture, confidence });

        if (this.gestureBuffer.length > this.bufferSize) {
            this.gestureBuffer.shift();
        }
    }

    getStableGesture() {
        // Return gesture if it appears consistently in buffer
        if (this.gestureBuffer.length < this.bufferSize) {
            return null;
        }

        // Count occurrences of each gesture
        const gestureCounts = {};
        let maxCount = 0;
        let mostFrequentGesture = null;

        this.gestureBuffer.forEach(({ gesture, confidence }) => {
            if (confidence > this.confidenceThreshold) {
                gestureCounts[gesture] = (gestureCounts[gesture] || 0) + 1;
                if (gestureCounts[gesture] > maxCount) {
                    maxCount = gestureCounts[gesture];
                    mostFrequentGesture = gesture;
                }
            }
        });

        // Return gesture if it appears in majority of buffer
        if (maxCount >= Math.ceil(this.bufferSize * 0.6)) {
            return mostFrequentGesture;
        }

        return null;
    }

    reset() {
        this.gestureBuffer = [];
        this.frameSkipCount = 0;
    }
}
