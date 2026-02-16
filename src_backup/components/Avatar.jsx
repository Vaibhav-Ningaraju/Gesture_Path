import React, { useEffect, useRef } from 'react';

const Avatar = ({ sigmlData, width = 400, height = 400 }) => {
    const avatarRef = useRef(null);

    useEffect(() => {
        // Initialize CWASA if not already initialized
        if (window.CWASA && window.CWASA.init) {
            window.CWASA.init();
        }
    }, []);

    useEffect(() => {
        if (sigmlData && window.CWASA) {
            try {
                window.CWASA.playSiGMLText(sigmlData);
            } catch (error) {
                console.error("Error playing SiGML:", error);
            }
        }
    }, [sigmlData]);

    return (
        <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-3xl p-4 border border-slate-700/50 shadow-2xl">
            <div
                id="cwasa-gui"
                className="rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900"
                style={{ width, height }}
            ></div>
            <div className="mt-4 flex gap-2">
                {['anna', 'marc', 'luna'].map((avatar) => (
                    <button
                        key={avatar}
                        onClick={() => window.CWASA.setAvatar(avatar)}
                        className="px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-600 transition-colors uppercase"
                    >
                        {avatar}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Avatar;
