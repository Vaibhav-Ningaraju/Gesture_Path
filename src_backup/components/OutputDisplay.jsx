import React, { useEffect, useRef } from 'react';
import { Volume2, Copy, RotateCcw } from 'lucide-react';
import { speakText } from '../services/speechServices';

export default function OutputDisplay({ text, history, onClear }) {
    const historyRef = useRef(null);

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [history]);

    const handleSpeak = () => {
        if (text) speakText(text);
    };

    const handleCopy = () => {
        if (text) navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-700">Translation Output</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleSpeak}
                        disabled={!text}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Speak text"
                    >
                        <Volume2 size={18} />
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={!text}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Copy text"
                    >
                        <Copy size={18} />
                    </button>
                    <button
                        onClick={onClear}
                        disabled={!text && history.length === 0}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Clear history"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Main Output */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex-1 flex items-center justify-center min-h-[120px]">
                    {text ? (
                        <p className="text-2xl md:text-3xl font-medium text-center text-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {text}
                        </p>
                    ) : (
                        <p className="text-gray-400 text-center italic">
                            Waiting for input...
                        </p>
                    )}
                </div>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50/50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        History
                    </div>
                    <div
                        ref={historyRef}
                        className="max-h-32 overflow-y-auto p-4 space-y-2"
                    >
                        {history.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100 shadow-sm">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
