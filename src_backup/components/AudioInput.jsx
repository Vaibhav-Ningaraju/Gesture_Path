import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { SpeechRecognitionService } from '../services/speechServices';

export default function AudioInput({ onTranscriptChange, isActive }) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const speechService = useRef(new SpeechRecognitionService());

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            speechService.current.stop();
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            speechService.current.stop();
            setIsListening(false);
        } else {
            setError(null);
            speechService.current.start(
                (result) => {
                    onTranscriptChange(result);
                },
                (err) => {
                    console.error('Speech recognition error:', err);
                    setError('Microphone access denied or not supported');
                    setIsListening(false);
                }
            );
            setIsListening(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <button
                onClick={toggleListening}
                className={`
          relative flex items-center justify-center w-20 h-20 rounded-full transition-all
          ${isListening
                        ? 'bg-red-500 shadow-[0_0_0_8px_rgba(239,68,68,0.3)] animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}
        `}
            >
                {isListening ? (
                    <MicOff className="w-8 h-8 text-white" />
                ) : (
                    <Mic className="w-8 h-8 text-white" />
                )}
            </button>

            <div className="mt-4 text-center">
                <p className={`font-medium ${isListening ? 'text-red-500' : 'text-gray-600'}`}>
                    {isListening ? 'Listening...' : 'Tap to Speak'}
                </p>
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
        </div>
    );
}
