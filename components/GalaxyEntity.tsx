
import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { AITool } from '../types';

interface GalaxyEntityProps {
    tool: AITool;
    index: number;
    total: number;
    radius: number;
    searchQuery: string;
    globalRotation: MotionValue<number>;
    onLaunch: (tool: AITool) => void;
}

export const GalaxyEntity: React.FC<GalaxyEntityProps> = ({ tool, index, total, radius, searchQuery, globalRotation, onLaunch }) => {
    const baseAngle = (index / total) * Math.PI * 2;
    const radiusY = radius * 0.75;

    const x = useTransform(globalRotation, (rot) => {
        const angle = baseAngle + (rot * Math.PI / 180);
        return Math.cos(angle) * radius;
    });

    const y = useTransform(globalRotation, (rot) => {
        const angle = baseAngle + (rot * Math.PI / 180);
        return Math.sin(angle) * radiusY;
    });

    // Surgical Fix: Safe Domain extraction and Fallbacks
    let domain = '';
    try {
        domain = tool.url ? new URL(tool.url).hostname : '';
    } catch (e) {
        domain = '';
    }

    // Logic Rendering Fallbacks: {app.url || '#'} and {app.icon || '🔗'}
    const safeUrl = tool.url || '#';
    const safeIcon = tool.icon || '🔗';
    const logoUrl = tool.logoUrl || (domain ? `https://www.google.com/s2/favicons?sz=128&domain=${domain}` : '');

    const isMatch = !searchQuery ||
        (tool.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onLaunch(tool);
    };

    return (
        <motion.div
            className="absolute flex items-center justify-center"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: isMatch ? 1 : 0.05,
                scale: isMatch ? 1 : 0.7
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
                type: "spring",
                stiffness: 60,
                damping: 18,
                delay: index * 0.03
            }}
        >
            <div className="flex items-center justify-center">
                <motion.div
                    animate={{
                        y: [0, -12, 0],
                        x: [0, 8, 0],
                    }}
                    transition={{
                        duration: 5 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative group pointer-events-auto"
                >
                    <motion.a
                        href={safeUrl}
                        onClick={handleClick}
                        whileHover={{ scale: 1.12, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
              w-36 h-36 md:w-40 md:h-40 rounded-3xl flex flex-col items-center justify-center p-3
              bg-[#1c1c1c]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.15)]
              hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] hover:border-purple-500/50 transition-all overflow-visible
              cursor-pointer
            `}
                    >
                        <div className="absolute inset-0 bg-white/5 opacity-20 group-hover:opacity-40 transition-opacity rounded-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/10 blur-3xl rounded-full" />

                        <div className={`relative z-10 w-18 h-18 md:w-20 md:h-20 mb-3 flex items-center justify-center overflow-hidden rounded-xl`}>
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={tool.name}
                                    className="w-full h-full object-contain filter drop-shadow-2xl bg-transparent"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22none%22/><text x=%2250%%22 y=%2250%%22 dy=%22.35em%22 text-anchor=%22middle%22 font-family=%22Orbitron, sans-serif%22 font-weight=%22bold%22 font-size=%2260%22 fill=%22white%22>${(tool.name || 'A').charAt(0)}</text></svg>`;
                                    }}
                                />
                            ) : (
                                <span className="text-4xl text-white/40 font-tech font-bold">{safeIcon}</span>
                            )}
                        </div>

                        <div className="relative z-10 w-full flex items-center justify-center min-h-[2.4em]">
                            <span className="px-2 text-[10px] font-tech font-bold text-white/95 tracking-[0.1em] uppercase text-center whitespace-normal [word-break:keep-all] line-clamp-2 leading-tight drop-shadow-sm">
                                {tool.name || 'Unnamed App'}
                            </span>
                        </div>

                        <div className="absolute inset-[1px] rounded-3xl border border-white/10 pointer-events-none" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.a>
                </motion.div>
            </div>
        </motion.div>
    );
};
