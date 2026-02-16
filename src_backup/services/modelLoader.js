import * as tf from '@tensorflow/tfjs';

// Load pre-trained model
export async function loadGestureModel() {
    try {
        // Option 1: Load from your server (public folder)
        // Note: You need to train the model using the provided Python scripts
        // and place the 'tfjs_model' folder in 'public/models/'
        const model = await tf.loadLayersModel('/models/tfjs_model/model.json');
        console.log('Gesture recognition model loaded successfully');
        return model;
    } catch (error) {
        console.warn('Failed to load model - using simulation mode:', error);
        // Return null to trigger fallback/simulation mode
        return null;
    }
}

// Load label map
export async function loadLabelMap() {
    try {
        const response = await fetch('/models/label_map.json');
        if (!response.ok) {
            throw new Error('Label map not found');
        }
        const labelMap = await response.json();

        // Create reverse mapping (Index -> Label)
        const reverseLabelMap = {};
        for (const [label, idx] of Object.entries(labelMap)) {
            reverseLabelMap[idx] = label;
        }

        return reverseLabelMap;
    } catch (error) {
        console.warn('Failed to load label map - using simulation mode:', error);
        return null;
    }
}
