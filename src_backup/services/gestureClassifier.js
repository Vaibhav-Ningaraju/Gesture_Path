import * as tf from '@tensorflow/tfjs';
import { extractFeatures } from './featureExtractor';
import { ISL_GESTURES } from '../data/islGestures';

export async function classifyGesture(landmarks, model, labelMap) {
    // If model not loaded, use simulated detection for demo/fallback
    if (!model || !labelMap) {
        return simulateGestureDetection();
    }

    try {
        // Extract features
        const features = extractFeatures(landmarks);

        if (!features || features.length === 0) {
            return null;
        }

        // Convert to tensor
        const inputTensor = tf.tensor2d([features]);

        // Make prediction
        const prediction = model.predict(inputTensor);
        const probabilities = await prediction.data();

        // Get top prediction
        const maxProb = Math.max(...probabilities);
        const predictedIndex = Array.from(probabilities).indexOf(maxProb);
        const predictedClass = labelMap[predictedIndex];

        // Cleanup tensors
        inputTensor.dispose();
        prediction.dispose();

        // Only return if confidence is above threshold
        if (maxProb > 0.6) {
            return {
                gesture: predictedClass,
                confidence: maxProb
            };
        }

        return null;
    } catch (error) {
        console.error('Gesture classification error:', error);
        return null;
    }
}

function simulateGestureDetection() {
    // Fallback for demo purposes or when model isn't trained yet
    // Returns a random gesture from our supported list
    const gestureKeys = Object.keys(ISL_GESTURES);

    // Simulate "no gesture" most of the time to be less annoying
    if (Math.random() > 0.1) return null;

    const randomGesture = gestureKeys[Math.floor(Math.random() * gestureKeys.length)];

    return {
        gesture: randomGesture,
        confidence: 0.75 + Math.random() * 0.2
    };
}
