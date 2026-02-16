import React from 'react';
import { Plus, MessageSquare, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onNewChat, history, onSelectHistory }) => {
    const { user, logout } = useAuth();

    return (
        <div className="w-64 h-screen bg-[#0f172a] border-r border-slate-800 flex flex-col flex-shrink-0">
            {/* Header / Logo Area */}
            <div className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    {/* Simple Logo Icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="font-bold text-lg text-white">Gesture Path</span>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-4">
                <button
                    onClick={onNewChat}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 flex items-center gap-2 transition-colors font-medium text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New chat
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                <div className="text-xs font-semibold text-slate-500 px-2 mb-2 uppercase tracking-wider">Conversations</div>
                <div className="space-y-1">
                    {/* Instant Conversion Item (Static for now as per mockup) */}
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-3 transition-colors group">
                        <div className="w-4 h-4 text-slate-500 group-hover:text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
                        <span className="text-sm truncate">Instant Conversion</span>
                    </button>

                    {history.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelectHistory(item)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-3 transition-colors group"
                        >
                            <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-white" />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm truncate">{item.content || "New Conversation"}</span>
                                <span className="text-[10px] text-slate-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* User / Footer */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-slate-400 hover:text-white cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="text-sm font-medium">{user?.username || 'User'}</div>
                    </div>
                    <button onClick={logout} title="Logout" className="hover:text-red-400 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
