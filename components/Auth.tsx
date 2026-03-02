import React from 'react';

export const Auth: React.FC<{ onAuthComplete: () => void }> = () => {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-10 flex flex-col items-center">
                    <h1 className="text-4xl font-tech font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] animate-gradient text-glow text-center mb-4">
                        Heading to Space
                    </h1>
                    <p className="text-gray-400 text-center mb-8 font-light tracking-wide">
                        Your personal AI library and workspace is initializing.
                    </p>

                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <span className="text-xs font-tech font-bold tracking-[0.2em] text-blue-400 uppercase">Connecting to Galaxy...</span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 5s ease infinite;
                }
            `}} />
        </div>
    );
};
