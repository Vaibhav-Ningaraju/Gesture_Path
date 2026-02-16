import React from 'react';
import { Camera, Mic, Type, ArrowRightLeft } from 'lucide-react';

export const MODES = {
    VISUAL_TO_TEXT: 'visual-text',
    VISUAL_TO_AUDIO: 'visual-audio',
    AUDIO_TO_VISUAL: 'audio-visual',
    TEXT_TO_VISUAL: 'text-visual',
    INSTANT: 'instant-mix'
};

export default function ModeSelector({ onSelectMode }) {
    const modes = [
        {
            id: MODES.VISUAL_TO_TEXT,
            title: 'Sign to Text',
            description: 'Translate ISL gestures to English text',
            icon: Camera,
            color: 'bg-blue-500'
        },
        {
            id: MODES.VISUAL_TO_AUDIO,
            title: 'Sign to Speech',
            description: 'Convert gestures to spoken English',
            icon: Mic,
            color: 'bg-purple-500'
        },
        {
            id: MODES.AUDIO_TO_VISUAL,
            title: 'Speech to Sign',
            description: 'Convert spoken English to ISL animations',
            icon: ArrowRightLeft,
            color: 'bg-green-500'
        },
        {
            id: MODES.TEXT_TO_VISUAL,
            title: 'Text to Sign',
            description: 'Type English to see ISL signs',
            icon: Type,
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto p-6">
            {modes.map((mode) => (
                <button
                    key={mode.id}
                    onClick={() => onSelectMode(mode.id)}
                    className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 group"
                >
                    <div className={`p-4 rounded-full ${mode.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                        <mode.icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{mode.title}</h3>
                    <p className="text-gray-500 text-center">{mode.description}</p>
                </button>
            ))}
        </div>
    );
}
