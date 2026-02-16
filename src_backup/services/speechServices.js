// Speech Recognition (Speech to Text)
export class SpeechRecognitionService {
    constructor() {
        this.recognition = null;
        this.isListening = false;

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
        } else {
            console.error('Speech Recognition API not supported in this browser.');
        }
    }

    start(onResult, onError) {
        if (!this.recognition) return;

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            onResult({ final: finalTranscript, interim: interimTranscript });
        };

        this.recognition.onerror = (event) => {
            if (onError) onError(event.error);
        };

        try {
            this.recognition.start();
            this.isListening = true;
        } catch (e) {
            console.error('Error starting speech recognition:', e);
        }
    }

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
}

// Speech Synthesis (Text to Speech)
export const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
        console.error('Speech Synthesis API not supported');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
};
