import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, Crown, Trophy, Heart, Pizza, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';
import { fireGrandConfetti, fireSideCannons } from '../utils/confetti';

interface MysteryGiftBoxProps {
  bestieName: string;
}

export const MysteryGiftBox: React.FC<MysteryGiftBoxProps> = ({ bestieName }) => {
  const [boxState, setBoxState] = useState<'closed' | 'untying' | 'open'>('closed');

  const gifts = [
    {
      title: 'World’s #1 Bestie Gold Crown',
      icon: <Crown className="w-8 h-8 text-amber-400" />,
      desc: 'Officially certified supreme queen / legend of my universe!',
      badge: 'Royal VIP',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40',
    },
    {
      title: 'Lifetime Free Emotional Support',
      icon: <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />,
      desc: '3 AM calls, crying sessions, hype talks & zero judgment forever.',
      badge: 'Unconditional',
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/40',
    },
    {
      title: 'Unlimited Food & Treat Voucher',
      icon: <Pizza className="w-8 h-8 text-orange-400" />,
      desc: 'Free midnight burgers, chai-bun, pasta & ice cream on my bill.',
      badge: 'Foodie Fiesta',
      color: 'from-orange-500/20 to-red-500/20 border-orange-500/40',
    },
    {
      title: 'Friendship Hall of Fame Trophy',
      icon: <Trophy className="w-8 h-8 text-yellow-300" />,
      desc: 'For putting up with my nonsense and never giving up on me.',
      badge: 'Grand Winner',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40',
    },
  ];

  const handleOpenGift = () => {
    if (boxState === 'open') return;

    setBoxState('untying');
    sound.playChime(1.2);

    setTimeout(() => {
      setBoxState('open');
      sound.playCelebrationFanfare();
      fireGrandConfetti();
      fireSideCannons();
    }, 600);
  };

  const handleReset = () => {
    sound.playChime(1.0);
    setBoxState('closed');
  };

  return (
    <div id="mystery-gift-zone" className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 bg-white border-8 border-pink-400 shadow-[14px_14px_0px_rgba(244,114,182,0.5)] overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-black border-2 border-pink-300 mb-2">
          <Gift className="w-4 h-4 text-pink-600" />
          Interactive 3D Surprise Unboxing
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-pink-600 leading-tight">
          VIP Mystery Birthday Box for {bestieName} 🎁
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1">
          {boxState === 'open'
            ? '✨ Surprises Unboxed! Look at your special virtual gifts! ✨'
            : 'Tap the gift box to untie the ribbon and pop open the grand surprises!'}
        </p>
      </div>

      {/* Gift Box Stage */}
      <div className="relative flex flex-col items-center justify-center min-h-[300px]">
        <AnimatePresence mode="wait">
          {boxState !== 'open' ? (
            <motion.div
              key="closed-box"
              animate={
                boxState === 'untying'
                  ? { scale: [1, 1.15, 1.25], rotate: [-4, 4, -4, 4, 0] }
                  : { y: [0, -10, 0] }
              }
              transition={{ repeat: boxState === 'untying' ? 0 : Infinity, duration: 3, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenGift}
              className="relative cursor-pointer group flex flex-col items-center select-none"
            >
              {/* Floating Sparkles around box */}
              <div className="absolute -top-6 -left-6 w-8 h-8 text-yellow-400 animate-spin">
                <Sparkles className="w-full h-full" />
              </div>
              <div className="absolute -top-4 -right-6 w-6 h-6 text-pink-500 animate-bounce">
                <Sparkles className="w-full h-full" />
              </div>

              {/* 3D Box Lid with Bow */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Golden Bow Ribbons */}
                <div className="flex items-end justify-center -mb-2 z-20">
                  <div className="w-9 h-9 rounded-full border-4 border-yellow-300 bg-yellow-400 shadow-lg transform -rotate-25 -mr-1" />
                  <div className="w-9 h-9 rounded-full border-4 border-yellow-300 bg-yellow-400 shadow-lg transform rotate-25 -ml-1" />
                  <div className="absolute w-6 h-6 rounded-full bg-yellow-400 shadow-md border-2 border-white" />
                </div>

                {/* Box Lid Rectangle */}
                <div className="w-48 sm:w-56 h-11 rounded-t-2xl bg-pink-500 border-4 border-pink-300 shadow-xl flex items-center justify-center relative overflow-hidden">
                  {/* Yellow cross ribbon on lid */}
                  <div className="w-8 h-full bg-yellow-400 border-x-2 border-yellow-300 shadow-sm" />
                </div>
              </div>

              {/* Box Body */}
              <div className="w-44 sm:w-52 h-36 sm:h-40 rounded-b-3xl bg-pink-600 border-4 border-pink-400 shadow-2xl relative flex items-center justify-center overflow-hidden">
                {/* Yellow Vertical Ribbon */}
                <div className="w-8 h-full bg-yellow-400 border-x-2 border-yellow-300 shadow-sm" />
                {/* Yellow Horizontal Ribbon */}
                <div className="absolute inset-x-0 h-8 bg-yellow-400 border-y-2 border-yellow-300 shadow-sm" />

                <div className="absolute bottom-3 text-center z-10">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-950 bg-yellow-300 px-4 py-1.5 rounded-full border-2 border-yellow-500 shadow-md">
                    CLICK TO UNWRAP 🎁
                  </span>
                </div>
              </div>

              {/* Glowing shadow under box */}
              <div className="w-40 sm:w-48 h-6 bg-pink-400/40 rounded-full blur-md mt-2" />
            </motion.div>
          ) : (
            /* Open State: Revealed Gifts */
            <motion.div
              key="opened-gifts"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {gifts.map((gift, i) => (
                  <motion.div
                    key={gift.title}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="p-5 rounded-3xl bg-yellow-50 border-4 border-yellow-300 shadow-[8px_8px_0px_rgba(251,191,36,0.5)] flex flex-col items-center text-center"
                  >
                    <div className="p-3.5 rounded-2xl bg-white shadow-md mb-3 border-2 border-slate-200">
                      {gift.icon}
                    </div>

                    <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px] font-black uppercase tracking-wider mb-2 border-2 border-pink-300">
                      {gift.badge}
                    </span>

                    <h4 className="text-base sm:text-lg font-black font-display text-slate-900 mb-1">
                      {gift.title}
                    </h4>

                    <p className="text-xs text-slate-700 font-bold leading-relaxed mt-1">
                      {gift.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-full bg-yellow-100 hover:bg-yellow-200 text-slate-900 text-xs sm:text-sm font-black border-2 border-yellow-400 flex items-center gap-2 cursor-pointer transition active:scale-95 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Wrap & Close Box Again</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
