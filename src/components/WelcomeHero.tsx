import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Crown, Heart, Gift, PartyPopper, Cake, Flame, Trophy, Wand2 } from 'lucide-react';
import { fireGrandConfetti } from '../utils/confetti';
import { sound } from '../utils/audio';

interface WelcomeHeroProps {
  bestieName: string;
  nickname: string;
  age: number;
  customTitle: string;
  onOpenCustomizer: () => void;
  onJumpToSection: (sectionId: string) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  bestieName,
  nickname,
  age,
  customTitle,
  onOpenCustomizer,
  onJumpToSection,
}) => {
  const handleConfettiShower = () => {
    sound.playChime(1.3);
    fireGrandConfetti();
  };

  return (
    <div
      id="welcome-hero-zone"
      className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 bg-white border-8 border-pink-400 shadow-[16px_16px_0px_rgba(244,114,182,0.4)] overflow-hidden text-center"
    >
      {/* Decorative Floating Colorful Confetti Elements */}
      <div className="absolute top-6 left-8 text-3xl sm:text-4xl transform -rotate-12 select-none pointer-events-none opacity-80">
        ✨
      </div>
      <div className="absolute top-8 right-10 text-3xl sm:text-4xl transform rotate-12 select-none pointer-events-none opacity-80">
        🎉
      </div>
      <div className="absolute bottom-6 left-10 text-3xl sm:text-4xl select-none pointer-events-none opacity-80">
        🎁
      </div>
      <div className="absolute bottom-8 right-8 text-3xl sm:text-4xl select-none pointer-events-none opacity-80">
        🍰
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
        {/* Top Eyebrow */}
        <p className="uppercase tracking-[0.3em] text-pink-500 font-black text-xs sm:text-sm">
          BESTIE FOREVER • SPECIAL BIRTHDAY EDITION
        </p>

        {/* Grand Typography Headline (Vibrant Palette style with layered shadows) */}
        <h1
          className="text-4xl sm:text-7xl md:text-8xl font-black text-pink-600 leading-tight font-display tracking-tight vibrant-text-shadow-pink"
        >
          HAPPY BIRTHDAY,<br />
          <span className="text-yellow-500 inline-block drop-shadow-sm">
            {bestieName}! 💖
          </span>
        </h1>

        {/* Subtitle Pill Badge */}
        <div className="inline-flex items-center gap-3 bg-pink-100 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-pink-300 shadow-sm">
          <span className="text-2xl animate-pulse">💖</span>
          <span className="text-xl sm:text-3xl font-black text-pink-700 font-handwriting">
            TO MY BESTIE "{nickname}"
          </span>
          <span className="text-2xl animate-pulse">💖</span>
        </div>

        <p className="text-slate-700 font-medium italic text-base sm:text-xl max-w-2xl">
          "{customTitle} — Turning <span className="text-pink-600 font-black underline decoration-yellow-400 underline-offset-4">{age} Years</span> of Absolute Magic & Pure Craziness!"
        </p>

        {/* Bestie Friendship Stats Cards with Vibrant Pop Palette & Slight Tilts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-2">
          <div className="bg-yellow-400 p-4 rounded-2xl transform rotate-2 sm:rotate-3 shadow-lg border-2 border-yellow-500 flex flex-col items-center justify-center">
            <p className="text-[11px] font-black uppercase text-amber-950 tracking-wider">Years of Joy</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-950 font-display">{age} Yrs</p>
          </div>

          <div className="bg-blue-400 p-4 rounded-2xl transform -rotate-2 sm:-rotate-3 shadow-lg border-2 border-blue-500 flex flex-col items-center justify-center text-white">
            <p className="text-[11px] font-black uppercase text-blue-950 tracking-wider">Inside Jokes</p>
            <p className="text-2xl sm:text-3xl font-black text-white font-display">99,999+</p>
          </div>

          <div className="bg-purple-400 p-4 rounded-2xl transform rotate-1 shadow-lg border-2 border-purple-500 flex flex-col items-center justify-center text-white">
            <p className="text-[11px] font-black uppercase text-purple-950 tracking-wider">Craziness</p>
            <p className="text-2xl sm:text-3xl font-black text-white font-display">Infinite ∞</p>
          </div>

          <div className="bg-pink-400 p-4 rounded-2xl transform -rotate-1 shadow-lg border-2 border-pink-500 flex flex-col items-center justify-center text-white">
            <p className="text-[11px] font-black uppercase text-pink-950 tracking-wider">Bestie Bond</p>
            <p className="text-2xl sm:text-3xl font-black text-white font-display">100% VIP</p>
          </div>
        </div>

        {/* Playful Dot Trio */}
        <div className="flex justify-center space-x-3 pt-2">
          <div className="h-3 w-3 rounded-full bg-pink-400"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
          <div className="h-3 w-3 rounded-full bg-blue-400"></div>
        </div>

        {/* Action Button Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={handleConfettiShower}
            className="px-8 py-3.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-2 border-pink-400"
          >
            <PartyPopper className="w-5 h-5" />
            <span>BLAST CONFETTI (કન્ફેટી બ્લાસ્ટ) 🎊</span>
          </button>

          <button
            onClick={() => onJumpToSection('birthday-cake-zone')}
            className="px-6 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-lg border-2 border-yellow-500 flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-105 transition-all"
          >
            <Cake className="w-4 h-4" />
            <span>Cut Birthday Cake 🎂</span>
          </button>

          <button
            onClick={() => onJumpToSection('firecracker-zone')}
            className="px-6 py-3.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-black text-sm sm:text-base shadow-lg border-2 border-blue-400 flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-105 transition-all"
          >
            <Flame className="w-4 h-4" />
            <span>Sky Fireworks 🎆</span>
          </button>

          <button
            onClick={onOpenCustomizer}
            className="px-5 py-3.5 rounded-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs sm:text-sm shadow-md border-2 border-purple-300 flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-105 transition-all"
          >
            <Wand2 className="w-4 h-4" />
            <span>Personalize Details ✏️</span>
          </button>
        </div>

        {/* Quick Jump Anchors Carousel */}
        <div className="pt-4 border-t-2 border-pink-200 w-full flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-xs font-bold text-pink-700">
          <button
            onClick={() => onJumpToSection('polaroid-memories')}
            className="hover:text-pink-900 bg-pink-50 hover:bg-pink-100 px-3 py-1 rounded-full border border-pink-200 transition flex items-center gap-1 cursor-pointer"
          >
            📸 <u>Polaroid Wall</u>
          </button>
          <button
            onClick={() => onJumpToSection('balloon-pop-zone')}
            className="hover:text-pink-900 bg-yellow-100 hover:bg-yellow-200 text-amber-900 px-3 py-1 rounded-full border border-yellow-300 transition flex items-center gap-1 cursor-pointer"
          >
            🎈 <u>Balloon Pop Game</u>
          </button>
          <button
            onClick={() => onJumpToSection('mystery-gift-zone')}
            className="hover:text-pink-900 bg-purple-100 hover:bg-purple-200 text-purple-900 px-3 py-1 rounded-full border border-purple-200 transition flex items-center gap-1 cursor-pointer"
          >
            🎁 <u>Mystery Gift Box</u>
          </button>
          <button
            onClick={() => onJumpToSection('scratch-card-zone')}
            className="hover:text-pink-900 bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-1 rounded-full border border-blue-200 transition flex items-center gap-1 cursor-pointer"
          >
            🪙 <u>Scratch & Win</u>
          </button>
          <button
            onClick={() => onJumpToSection('report-card-zone')}
            className="hover:text-pink-900 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
          >
            🏆 <u>Bestie Certificate</u>
          </button>
          <button
            onClick={() => onJumpToSection('wish-jar-zone')}
            className="hover:text-pink-900 bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1 rounded-full border border-amber-200 transition flex items-center gap-1 cursor-pointer"
          >
            ⭐ <u>Wish Jar</u>
          </button>
        </div>
      </div>
    </div>
  );
};

