import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown, PartyPopper, Play, Music, Heart } from 'lucide-react';
import { sound } from '../utils/audio';
import { fireGrandConfetti, fireSideCannons } from '../utils/confetti';

interface GrandCurtainProps {
  bestieName: string;
  nickname: string;
  isOpen: boolean;
  onOpen: () => void;
}

export const GrandCurtain: React.FC<GrandCurtainProps> = ({
  bestieName,
  nickname,
  isOpen,
  onOpen,
}) => {
  const [isPulling, setIsPulling] = useState(false);

  const handleOpen = () => {
    if (isPulling) return;
    setIsPulling(true);
    sound.playChime(1.2);
    sound.playCelebrationFanfare();
    
    setTimeout(() => {
      onOpen();
      fireGrandConfetti();
      fireSideCannons();
      sound.playHappyBirthday();
    }, 400);
  };

  const handleInstantOpen = () => {
    onOpen();
    fireGrandConfetti();
    sound.playHappyBirthday();
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          id="grand-curtain-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className={`fixed inset-0 z-50 overflow-hidden flex flex-col justify-between select-none bg-yellow-50 ${isPulling ? 'pointer-events-none' : ''}`}
        >
          {/* Top Valance / Pelmet with Bright Yellow Trim & Stars (Vibrant Palette style) */}
          <div className="relative z-30 w-full h-16 sm:h-20 curtain-valance-vibrant flex items-center justify-around px-4 shadow-xl">
            <div className="text-yellow-300 text-2xl sm:text-3xl animate-pulse">✦</div>
            <div className="text-yellow-300 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '0.2s' }}>✦</div>
            <div className="hidden sm:block text-yellow-300 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '0.4s' }}>✦</div>
            <div className="flex items-center gap-2 bg-yellow-400 text-slate-950 font-black px-6 py-1.5 rounded-full border-2 border-yellow-200 text-xs sm:text-sm uppercase tracking-widest shadow-md">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>GRAND BIRTHDAY PREMIERE</span>
              <Sparkles className="w-4 h-4 text-pink-600" />
            </div>
            <div className="hidden sm:block text-yellow-300 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '0.6s' }}>✦</div>
            <div className="text-yellow-300 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '0.8s' }}>✦</div>
            <div className="text-yellow-300 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
          </div>

          {/* Center Stage Preview & Interactive Pull Area */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-4 z-20">
            {/* Playful Floating Confetti shapes in background */}
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center overflow-hidden">
              <div className="absolute top-16 left-20 w-16 h-16 rounded-full bg-pink-400/50 blur-lg" />
              <div className="absolute bottom-16 right-20 w-20 h-20 rounded-full bg-yellow-400/50 blur-lg" />
              <div className="absolute top-1/3 right-1/4 text-4xl opacity-50 transform rotate-12">🎉</div>
              <div className="absolute bottom-1/3 left-1/4 text-4xl opacity-50 transform -rotate-12">✨</div>
            </div>

            {/* Glowing Vibrant Pop Medallion Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: [0.98, 1.02, 0.98], y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative p-8 sm:p-10 rounded-[2.5rem] max-w-lg w-full text-center bg-white border-8 border-pink-400 shadow-[16px_16px_0px_rgba(244,114,182,0.4)] z-30"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-amber-950 animate-bounce" />
              </div>

              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-black uppercase tracking-wider border-2 border-pink-300">
                <PartyPopper className="w-3.5 h-3.5" />
                Special Birthday Celebration
              </div>

              <h1 className="mt-4 text-3xl sm:text-5xl font-black font-display tracking-tight text-pink-600 vibrant-text-shadow-pink leading-tight">
                For My Dearest{' '}
                <span className="text-yellow-500 block sm:inline">{bestieName}! 💖</span>
              </h1>

              <p className="mt-2 text-pink-500 font-handwriting text-2xl sm:text-3xl font-bold">
                "{nickname}" ✨
              </p>

              <p className="mt-3 text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                A grand surprise gala is waiting behind the curtains! Get ready for sky fireworks, birthday cake slicing, memory walls & endless laughter!
              </p>

              {/* Playful Dot Trio */}
              <div className="flex justify-center space-x-2 my-4">
                <div className="h-2.5 w-2.5 rounded-full bg-pink-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
              </div>

              {/* Grand Open Button (Vibrant Palette) */}
              <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="open-curtain-btn"
                  onClick={handleOpen}
                  disabled={isPulling}
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-base sm:text-lg text-white bg-pink-600 hover:bg-pink-500 border-2 border-pink-300 hover:scale-105 active:scale-95 shadow-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <Play className="w-5 h-5 fill-white group-hover:animate-pulse" />
                  <span>OPEN THE CURTAIN (પડદો ખોલો) 🎉</span>
                </button>

                <button
                  onClick={handleInstantOpen}
                  className="px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-slate-800 bg-yellow-300 hover:bg-yellow-400 border-2 border-yellow-500 shadow-md cursor-pointer transition active:scale-95"
                >
                  Enter Directly ⚡
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-pink-600">
                <Music className="w-3.5 h-3.5 animate-spin" />
                <span>Audio & Music automatically plays upon opening!</span>
              </div>
            </motion.div>

            {/* Cord Pull Tassel on the right side */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              onClick={handleOpen}
              className="absolute right-4 sm:right-12 top-20 flex flex-col items-center cursor-pointer group z-30"
              title="Pull rope to open curtains!"
            >
              <div className="w-3 h-36 sm:h-48 bg-yellow-400 border-2 border-yellow-500 rounded-full shadow-md" />
              <div className="w-12 h-12 rounded-full bg-pink-500 border-3 border-yellow-300 shadow-xl flex items-center justify-center -mt-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="w-7 h-14 bg-yellow-500 rounded-b-2xl border-2 border-yellow-300 shadow-lg -mt-1" />
              <span className="text-[11px] text-slate-900 mt-2 font-black tracking-wider uppercase bg-yellow-300 border border-yellow-500 px-2.5 py-0.5 rounded-full shadow">
                Pull Cord
              </span>
            </motion.div>
          </div>

          {/* Left Curtain Wing (Vibrant Striped Red & Yellow) */}
          <motion.div
            animate={
              isPulling
                ? { x: '-100%', transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] } }
                : { x: 0 }
            }
            className="absolute top-0 left-0 w-1/2 h-full curtain-vibrant-left z-10 origin-left flex items-center justify-end"
          >
            <div className="absolute bottom-24 right-4 w-12 h-16 rounded-l-full border-l-4 border-yellow-300 bg-yellow-400/90 shadow-2xl flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
          </motion.div>

          {/* Right Curtain Wing (Vibrant Striped Red & Yellow) */}
          <motion.div
            animate={
              isPulling
                ? { x: '100%', transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] } }
                : { x: 0 }
            }
            className="absolute top-0 right-0 w-1/2 h-full curtain-vibrant-right z-10 origin-right flex items-center justify-start"
          >
            <div className="absolute bottom-24 left-4 w-12 h-16 rounded-r-full border-r-4 border-yellow-300 bg-yellow-400/90 shadow-2xl flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
          </motion.div>

          {/* Bottom Stage Footlights */}
          <div className="relative z-30 w-full h-8 bg-pink-700 border-t-4 border-yellow-400 flex justify-around items-center px-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-full bg-yellow-300 shadow-[0_0_12px_#fde047] animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

