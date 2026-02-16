import React, { useState, useEffect } from 'react';
import { Search, Play, FileText } from 'lucide-react';

const Library = ({ onPlaySign }) => {
    const [signs, setSigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch the list of files from the server
        // For now, we'll simulate or fetch if we add an endpoint
        // Let's assume we can search by trying to fetch common words or just showing a placeholder
        // Ideally, we add an endpoint to list all files.
        // Let's add that endpoint to server.js later. For now, placeholder.
        setLoading(false);
    }, []);

    const handleSearch = async () => {
        if (!searchTerm) return;
        // Simulate search by trying to translate the word
        try {
            const response = await fetch('http://localhost:5005/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: searchTerm }),
            });
            const data = await response.json();
            if (data.sequence && data.sequence.length > 0) {
                onPlaySign(data.sequence[0].sigml);
            }
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    return (
        <div className="p-6 text-white">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Sign Library</h2>

            <div className="mb-8 relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a sign..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 pl-12 text-white focus:outline-none focus:border-blue-500 transition-all"
                />
                <Search className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                <button
                    onClick={handleSearch}
                    className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Test
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Placeholder items */}
                {['Hello', 'Good Morning', 'Thank You', 'Welcome'].map((sign) => (
                    <div key={sign} className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer group" onClick={() => setSearchTerm(sign)}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{sign}</span>
                            </div>
                            <Play className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
