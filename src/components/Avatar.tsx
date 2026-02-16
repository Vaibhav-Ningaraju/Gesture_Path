import React, { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        CWASA: any;
        CWASA_CLIENT_CFG: any;
    }
}

interface AvatarProps {
    sigmlData?: string | null;
    width?: number | string;
    height?: number | string;
}

let avatarCounter = 0;

const Avatar: React.FC<AvatarProps> = ({ sigmlData, width = 400, height = 400 }) => {
    const [avatarId] = useState(() => avatarCounter++);
    const uniqueId = `cwasa-avatar-${avatarId}`;
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        let initTimer: NodeJS.Timeout;

        // Initialize CWASA
        if (window.CWASA && window.CWASA.init) {
            console.log(`Initializing CWASA for av${avatarId}...`);

            // Add event listener for avatar loaded
            if (window.CWASA.addHook) {
                window.CWASA.addHook("avatarloaded", () => {
                    if (!isMounted) return;
                    console.log(`Avatar loaded for av${avatarId}`);
                    if (sigmlData) {
                        playSiGML();
                    }
                }, avatarId);
            }

            initTimer = setTimeout(() => {
                window.CWASA.init().then(() => {
                    if (!isMounted) return;
                    console.log(`CWASA initialized for av${avatarId}`);
                    // We don't play here immediately, we wait for avatarloaded or check if already loaded
                }).catch((err: any) => console.error("CWASA init failed:", err));
            }, 100);
        }

        return () => {
            isMounted = false;
            clearTimeout(initTimer);
            // Attempt to stop any playing animation on unmount
            try {
                if (window.CWASA && window.CWASA.stopSiGML) {
                    window.CWASA.stopSiGML(avatarId);
                }
            } catch (e) {
                // Ignore errors on cleanup
            }
        };
    }, []);

    const playSiGML = () => {
        if (sigmlData && window.CWASA) {
            console.log(`Playing SiGML for av${avatarId}, length:`, sigmlData.length);
            try {
                // Stop any current animation first to avoid state errors
                if (window.CWASA.stopSiGML) {
                    window.CWASA.stopSiGML(avatarId);
                }
                // Small delay to allow stop to process
                setTimeout(() => {
                    if (window.CWASA && window.CWASA.playSiGMLText) {
                        window.CWASA.playSiGMLText(sigmlData, avatarId);
                    }
                }, 200);
            } catch (error) {
                console.error("Error playing SiGML:", error);
            }
        }
    };

    useEffect(() => {
        let playTimer: NodeJS.Timeout;
        if (sigmlData) {
            // Debounce playback to avoid rapid state changes
            playTimer = setTimeout(() => {
                playSiGML();
            }, 500);
        }
        return () => clearTimeout(playTimer);
    }, [sigmlData]);

    const handleAvatarChange = (avatar: string) => {
        if (menuRef.current) {
            // CWASA expects a change event on the menu element
            // But since we are using a div now (to avoid nested select), we need to see if CWASA supports div menus
            // Looking at allcsa.js, it attaches 'onchange' to the element. 
            // If we use a select, we must ensure it's not nested in another select.
            // The error "A <select> tag was parsed within another <select> tag" implies 
            // we might be rendering this inside a container that is somehow treated as a select? 
            // Or maybe CWASA replaces the element with its own select?

            // Let's try using a hidden input or just a div and see if we can trigger the change.
            // Actually, the error came from the browser parsing HTML. 
            // "A <select> tag was parsed within another <select> tag"
            // This usually happens if the parent is a select. But our parent is a div.
            // Wait, maybe CWASA injects a select INTO the element we provide?
            // allcsa.js: div.innerHTML = htmlgen.htmlForAvMenu();
            // If htmlForAvMenu returns a select, and we provided a select, then yes.
            // So we should provide a DIV for the menu container.

            // However, to control it programmatically, we need to find the select inside it.
            const select = menuRef.current.querySelector('select');
            if (select) {
                select.value = avatar;
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };

    const toggleFullscreen = () => {
        const elem = document.getElementById(uniqueId);
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-3xl p-4 border border-slate-700/50 shadow-2xl">
            <div
                id={uniqueId}
                className={`CWASAAvatar av${avatarId} rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900`}
                style={{ width, height }}
            ></div>

            {/* Container for CWASA Menu - MUST BE A DIV because CWASA injects a select into it */}
            <div
                ref={menuRef}
                className={`CWASAAvMenu av${avatarId}`}
                style={{ display: 'none' }}
            ></div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                    onClick={playSiGML}
                    className="px-4 py-1 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-full border border-green-500 transition-colors shadow-lg flex items-center gap-1"
                >
                    <span>↺</span> Replay
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="px-4 py-1 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-full border border-blue-500 transition-colors shadow-lg flex items-center gap-1"
                >
                    <span>⛶</span> Full Screen
                </button>
                {['anna', 'marc', 'luna'].map((avatar) => (
                    <button
                        key={avatar}
                        onClick={() => handleAvatarChange(avatar)}
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
