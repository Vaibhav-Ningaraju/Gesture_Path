import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import GestureDetector from './GestureDetector';
import AudioInput from './AudioInput';
import TextInput from './TextInput';
import OutputDisplay from './OutputDisplay';
import { MODES } from './ModeSelector';
import { speakText } from '../services/speechServices';
import { ISL_GESTURES } from '../data/islGestures';

export default function TranslationInterface({ selectedMode, onBack }) {
    const [outputText, setOutputText] = useState('');
    const [history, setHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    // Handle gesture detection results
    const handleGestureDetected = (result) => {
        const gesture = ISL_GESTURES[result.gesture];

        if (gesture) {
            const newText = gesture.name;

            // Avoid repeating the same word immediately unless it's been a while
            // Simple debounce logic is handled in GestureDetector, but we can add more here if needed

            setOutputText(newText);
            setHistory(prev => [...prev, newText]);
            setStatusMessage(`Detected: ${gesture.name} (${(result.confidence * 100).toFixed(0)}%)`);

            if (selectedMode === MODES.VISUAL_TO_AUDIO || selectedMode === MODES.INSTANT) {
                speakText(newText);
            }
        }
    };

    // Handle speech recognition results
    const handleSpeechResult = (result) => {
        if (result.final) {
            setOutputText(result.final);
            setHistory(prev => [...prev, result.final]);

            // In a full implementation, we would map this text to ISL videos/animations
            // For now, we just display it
        }
    };

    // Handle text input
    const handleTextSubmit = (text) => {
        if (!text) return;
        setOutputText(text);
        setHistory(prev => [...prev, text]);

        if (selectedMode === MODES.TEXT_TO_VISUAL) {
            // Trigger ISL visualization (future scope)
            setStatusMessage('Converting text to ISL...');
        }
    };

    const handleClear = () => {
        setOutputText('');
        setHistory([]);
        setStatusMessage('');
    };

    const getTitle = () => {
        switch (selectedMode) {
            case MODES.VISUAL_TO_TEXT: return 'Sign to Text';
            case MODES.VISUAL_TO_AUDIO: return 'Sign to Speech';
            case MODES.AUDIO_TO_VISUAL: return 'Speech to Sign';
            case MODES.TEXT_TO_VISUAL: return 'Text to Sign';
            default: return 'Translation';
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
                {statusMessage && (
                    <span className="ml-auto text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse">
                        {statusMessage}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Input</h2>

                        {/* Visual Input (Camera) */}
                        {(selectedMode === MODES.VISUAL_TO_TEXT ||
                            selectedMode === MODES.VISUAL_TO_AUDIO ||
                            selectedMode === MODES.INSTANT) && (
                                <GestureDetector
                                    onGestureDetected={handleGestureDetected}
                                    isActive={isProcessing}
                                />
                            )}

                        {/* Audio Input */}
                        {(selectedMode === MODES.AUDIO_TO_VISUAL ||
                            selectedMode === MODES.INSTANT) && (
                                <div className="h-full flex flex-col justify-center">
                                    <AudioInput
                                        onTranscriptChange={handleSpeechResult}
                                        isActive={isProcessing}
                                    />
                                </div>
                            )}

                        {/* Text Input */}
                        {(selectedMode === MODES.TEXT_TO_VISUAL) && (
                            <div className="h-full flex flex-col justify-center">
                                <TextInput
                                    value={outputText} // Reusing state for simplicity in this demo
                                    onChange={setOutputText}
                                    onSubmit={() => handleTextSubmit(outputText)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Output Section */}
                <div className="flex flex-col h-full">
                    <OutputDisplay
                        text={outputText}
                        history={history}
                        onClear={handleClear}
                    />

                    {/* Context/Help Info */}
                    <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-1">How to use</h4>
                        <p className="text-sm text-blue-600">
                            {selectedMode === MODES.VISUAL_TO_TEXT && "Show ISL gestures to the camera. Ensure good lighting and keep your hand within the frame."}
                            {selectedMode === MODES.VISUAL_TO_AUDIO && "Gestures will be automatically converted to spoken English."}
                            {selectedMode === MODES.AUDIO_TO_VISUAL && "Speak clearly into the microphone to see ISL translations."}
                            {selectedMode === MODES.TEXT_TO_VISUAL && "Type English text to translate it into ISL signs."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
