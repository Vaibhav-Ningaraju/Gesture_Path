import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Send, Image as ImageIcon } from 'lucide-react';
import Avatar from './Avatar';
import Sidebar from './Sidebar';
import ConversionModal from './ConversionModal';

const Dashboard = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeConversion, setActiveConversion] = useState(null); // null = Welcome Screen, object = Chat Screen
    const [inputText, setInputText] = useState('');
    const [currentSigml, setCurrentSigml] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5005/api/history/${user.id}`);
            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    const handleStartConversion = (config) => {
        setActiveConversion(config);
        setIsModalOpen(false);
    };

    const handleTranslate = async () => {
        if (!inputText) return;
        setIsTranslating(true);
        try {
            const response = await fetch('http://localhost:5005/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText }),
            });
            const data = await response.json();

            if (data.sequence && data.sequence.length > 0) {
                const combinedSigml = data.sequence.map(s => s.sigml).join('\n');
                setCurrentSigml(combinedSigml);
            }

            await fetch('http://localhost:5005/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    type: 'conversion',
                    content: inputText,
                }),
            });
            fetchHistory();
        } catch (error) {
            console.error('Failed to translate', error);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden font-inter">
            {/* Sidebar */}
            <Sidebar
                onNewChat={() => setActiveConversion(null)}
                history={history}
                onSelectHistory={(item) => {
                    setActiveConversion({ inputMode: 'text', outputMode: 'visual', instantMode: false });
                    setInputText(item.content);
                    // Optionally trigger translation immediately or just load state
                }}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative">

                {/* Top Bar (Optional, can be part of chat) */}
                {/* <div className="h-14 border-b border-slate-800 flex items-center px-6 justify-between">
            <span className="font-medium text-slate-300">Gesture Path</span>
        </div> */}

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative">

                    {!activeConversion ? (
                        // WELCOME SCREEN
                        <div className="text-center max-w-lg animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-white/10">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Welcome to Gesture Path</h1>
                            <p className="text-slate-400 mb-10">Start a new conversion to translate text, audio, or video into sign language animations.</p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20"
                                >
                                    Start New Conversion
                                </button>
                                <button
                                    onClick={() => handleStartConversion({ inputMode: 'text', outputMode: 'visual', instantMode: true })}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-purple-600/20"
                                >
                                    Try Instant Mode
                                </button>
                            </div>
                        </div>
                    ) : (
                        // CHAT / CONVERSION SCREEN
                        <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
                            {/* Avatar / Output Area */}
                            <div className="flex-1 flex items-center justify-center min-h-0 p-4">
                                {currentSigml ? (
                                    <Avatar sigmlData={currentSigml} width={600} height={500} />
                                ) : (
                                    <div className="text-center text-slate-500">
                                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Zap className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-400">Ready to Convert</h3>
                                        <p className="text-sm">Converting from {activeConversion.inputMode} to {activeConversion.outputMode}</p>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 pb-8">
                                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-2 flex items-end gap-2 shadow-xl">
                                    <button className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors">
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 p-3 max-h-32 resize-none custom-scrollbar"
                                        rows="1"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleTranslate();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleTranslate}
                                        disabled={!inputText || isTranslating}
                                        className={`p-3 rounded-xl transition-all ${inputText
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="text-center mt-3 text-xs text-slate-500">
                                    Gesture Path AI can make mistakes. Please review generated signs.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <ConversionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStart={handleStartConversion}
            />
        </div>
    );
};

export default Dashboard;
