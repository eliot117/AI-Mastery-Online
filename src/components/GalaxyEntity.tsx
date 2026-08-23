import React, { useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { OrbitItem, Tool } from '../types';
import {
  SAFE_LINK_REL,
  monogramDataUri,
  resolveLogoSrc,
  toSafeHref,
} from '../lib/safeUrl';

const FOLDER_ICON_URL = 'https://img.icons8.com/sci-fi/1200/folder-invoices.png';

interface GalaxyEntityProps {
  item: OrbitItem;
  index: number;
  total: number;
  radius: number;
  searchQuery: string;
  globalRotation: MotionValue<number>;
  onLaunch: (tool: Tool) => void;
  onOpenFolder: (target: string | null) => void;
}

export const GalaxyEntity: React.FC<GalaxyEntityProps> = ({
  item,
  index,
  total,
  radius,
  searchQuery,
  globalRotation,
  onLaunch,
  onOpenFolder,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const baseAngle = (index / total) * Math.PI * 2;
  const radiusY = radius * 0.75; // Elliptical, stretched vertically

  const x = useTransform(globalRotation, (rot: number) => {
    const angle = baseAngle + (rot * Math.PI) / 180;
    return Math.cos(angle) * radius;
  });

  const y = useTransform(globalRotation, (rot: number) => {
    const angle = baseAngle + (rot * Math.PI) / 180;
    return Math.sin(angle) * radiusY;
  });

  const tool = item.kind === 'tool' ? item.tool : null;
  const name = item.kind === 'tool' ? item.tool.name : item.name;

  const query = searchQuery.trim().toLowerCase();
  const isMatch =
    !query ||
    (tool !== null &&
      (tool.name.toLowerCase().includes(query) ||
        (tool.description ?? '').toLowerCase().includes(query)));

  const logoSrc = tool ? resolveLogoSrc(tool.logo_url, tool.url) : null;

  const handleFolderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.kind === 'folder') onOpenFolder(item.target);
  };

  /**
   * Deliberately does NOT preventDefault: the native anchor opens the new
   * tab, which keeps popup blockers out of the way and guarantees the
   * rel/target hardening actually applies. We only log the click and let
   * the parent play its launch flourish.
   */
  const handleToolClick = () => {
    if (tool) onLaunch(tool);
  };

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{ x, y, zIndex: isHovered ? 50 : 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: isMatch ? 1 : 0.05, scale: isMatch ? 1 : 0.7 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: 'spring', stiffness: 60, damping: 18, delay: index * 0.03 }}
    >
      <div className="flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="group pointer-events-auto relative"
        >
          {item.kind === 'folder' ? (
            <motion.button
              type="button"
              onClick={handleFolderClick}
              whileHover={{ scale: 1.12, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Open ${name}`}
              className="animate-gradient flex h-36 w-36 cursor-pointer flex-col items-center justify-center overflow-visible rounded-3xl border border-white/10 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] p-3 shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-all hover:border-white/30 hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:h-40 md:w-40"
            >
              <div className="relative z-10 mb-2 flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
                <img
                  src={FOLDER_ICON_URL}
                  alt=""
                  className="h-full w-full object-contain drop-shadow-2xl"
                />
              </div>
              <div className="relative z-10 flex min-h-[2.4em] w-full items-center justify-center">
                <span className="whitespace-normal px-2 text-center font-tech text-sm font-black uppercase leading-tight tracking-[0.05em] text-white drop-shadow-md md:text-base">
                  {name}
                </span>
              </div>
              <div className="pointer-events-none absolute inset-[1px] rounded-3xl border border-white/20" />
            </motion.button>
          ) : (
            <motion.a
              href={toSafeHref(tool!.url)}
              target="_blank"
              rel={SAFE_LINK_REL}
              onClick={handleToolClick}
              whileHover={{ scale: 1.12, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-36 w-36 cursor-pointer flex-col items-center justify-center overflow-visible rounded-3xl border border-white/10 bg-[#1c1c1c]/80 p-3 shadow-[0_0_30px_rgba(139,92,246,0.15)] backdrop-blur-3xl transition-all hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 md:h-40 md:w-40"
            >
              <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-20 transition-opacity group-hover:opacity-40" />
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative z-10 mb-3 flex h-18 w-18 items-center justify-center overflow-hidden rounded-xl md:h-20 md:w-20">
                <img
                  src={imgFailed || !logoSrc ? monogramDataUri(tool!.name) : logoSrc}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full bg-transparent object-contain drop-shadow-2xl"
                  onError={() => setImgFailed(true)}
                />
              </div>

              <div className="relative z-10 flex min-h-[2.4em] w-full items-center justify-center">
                <span className="line-clamp-2 whitespace-normal px-2 text-center font-tech text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-white/95 drop-shadow-sm [word-break:keep-all]">
                  {tool!.name}
                </span>
              </div>

              <div className="pointer-events-none absolute inset-[1px] rounded-3xl border border-white/10" />
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
