import React, { useState } from 'react';
import { X, Eye, Mic, Type, ArrowRight } from 'lucide-react';

const ConversionModal = ({ isOpen, onClose, onStart }) => {
    const [inputMode, setInputMode] = useState('text');
    const [outputMode, setOutputMode] = useState('visual');
    const [instantMode, setInstantMode] = useState(false);

    if (!isOpen) return null;

    const ModeOption = ({ icon: Icon, label, desc, value, selected, onSelect, color }) => (
        <div
            onClick={() => onSelect(value)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selected
                    ? `bg-[${color}]/10 border-blue-500 ring-1 ring-blue-500`
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
        >
            <div className={`p-2 rounded-lg ${selected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="font-medium text-white text-sm">{label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1e293b] rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Choose Conversion Mode</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Instant Mode Toggle */}
                    <div
                        onClick={() => setInstantMode(!instantMode)}
                        className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${instantMode ? 'bg-purple-900/20 border-purple-500/50' : 'bg-slate-800/50 border-slate-700'
                            }`}
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${instantMode ? 'bg-purple-600 border-purple-600' : 'border-slate-500'
                            }`}>
                            {instantMode && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <div>
                            <div className="text-white font-medium text-sm">Enable Instant Conversion Mode</div>
                            <div className="text-slate-400 text-xs">Real-time conversion as you type or upload content</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Input Mode */}
                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-slate-300 mb-2">Input Mode</div>
                            <ModeOption
                                icon={Eye} label="Visual/Animation" desc="Images, videos, animations"
                                value="visual" selected={inputMode === 'visual'} onSelect={setInputMode} color="#10b981"
                            />
                            <ModeOption
                                icon={Mic} label="Audio" desc="Voice recordings, music"
                                value="audio" selected={inputMode === 'audio'} onSelect={setInputMode} color="#3b82f6"
                            />
                            <ModeOption
                                icon={Type} label="Text" desc="Written content and text"
                                value="text" selected={inputMode === 'text'} onSelect={setInputMode} color="#a855f7"
                            />
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:flex justify-center pt-12">
                            <div className="bg-slate-700/50 p-2 rounded-full">
                                <ArrowRight className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        {/* Output Mode */}
                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-slate-300 mb-2">Output Mode</div>
                            <ModeOption
                                icon={Eye} label="Visual/Animation" desc="Images, videos, animations"
                                value="visual" selected={outputMode === 'visual'} onSelect={setOutputMode} color="#10b981"
                            />
                            <ModeOption
                                icon={Mic} label="Audio" desc="Voice recordings, music"
                                value="audio" selected={outputMode === 'audio'} onSelect={setOutputMode} color="#3b82f6"
                            />
                            <ModeOption
                                icon={Type} label="Text" desc="Written content and text"
                                value="text" selected={outputMode === 'text'} onSelect={setOutputMode} color="#a855f7"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 flex justify-end gap-3 bg-slate-800/30">
                    <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors">Cancel</button>
                    <button
                        onClick={() => onStart({ inputMode, outputMode, instantMode })}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Start Conversion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConversionModal;
