// Extract features from Holistic results (Face + Left Hand + Right Hand)
export const extractFeatures = (results) => {
    const features = [];

    // 1. Left Hand (21 points * 3)
    if (results.leftHandLandmarks) {
        for (const lm of results.leftHandLandmarks) {
            features.push(lm.x, lm.y, lm.z);
        }
    } else {
        // Zero padding if left hand not detected
        features.push(...new Array(21 * 3).fill(0));
    }

    // 2. Right Hand (21 points * 3)
    if (results.rightHandLandmarks) {
        for (const lm of results.rightHandLandmarks) {
            features.push(lm.x, lm.y, lm.z);
        }
    } else {
        // Zero padding if right hand not detected
        features.push(...new Array(21 * 3).fill(0));
    }

    return features;
};

function flattenLandmarks(landmarks) {
    const flat = [];
    for (const lm of landmarks) {
        flat.push(lm.x, lm.y, lm.z);
    }
    return flat;
}

// Legacy function for single hand (kept for reference or fallback)
function extractHandFeatures(landmarks) {
    const features = [];
    const wrist = landmarks[0];
    for (let i = 0; i < landmarks.length; i++) {
        features.push(landmarks[i].x - wrist.x, landmarks[i].y - wrist.y, landmarks[i].z - wrist.z);
    }
    return features;
}
