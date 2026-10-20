import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Send, Heart, MessageSquareHeart, User } from 'lucide-react';
import { WishItem } from '../types';
import { sound } from '../utils/audio';
import { fireHeartConfetti } from '../utils/confetti';

interface WishJarProps {
  bestieName: string;
}

const defaultWishes: WishItem[] = [
  {
    id: 'w1',
    author: 'Forever Bestie',
    text: 'May you get endless happiness, success in all your passions, and unlimited good food! ✨💖',
    timestamp: 'Just now',
    starColor: '#ffd700',
    emoji: '⭐',
  },
  {
    id: 'w2',
    author: 'Partner In Crime',
    text: 'Khub aagal vadho, hamesha must smile rakho ane aavi j masti karta raho! 🥳🎂',
    timestamp: 'Today',
    starColor: '#ff69b4',
    emoji: '🌟',
  },
  {
    id: 'w3',
    author: 'Secret Admirer (Me)',
    text: 'Wishing you a year filled with spontaneous road trips, zero stress, and all your wildest dreams turning real! 🚗✈️',
    timestamp: 'Today',
    starColor: '#00ffff',
    emoji: '💫',
  },
];

export const WishJar: React.FC<WishJarProps> = ({ bestieName }) => {
  const [wishes, setWishes] = useState<WishItem[]>(defaultWishes);
  const [authorName, setAuthorName] = useState('');
  const [wishText, setWishText] = useState('');
  const [selectedStarColor, setSelectedStarColor] = useState('#ffd700');
  const [activeWishDetail, setActiveWishDetail] = useState<WishItem | null>(null);

  const starColors = ['#ffd700', '#ff69b4', '#00ffff', '#a855f7', '#10b981', '#f97316'];

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    const newWish: WishItem = {
      id: `wish-${Date.now()}`,
      author: authorName.trim() || 'A Sweet Well-Wisher',
      text: wishText.trim(),
      timestamp: 'Just now',
      starColor: selectedStarColor,
      emoji: '⭐',
    };

    setWishes([newWish, ...wishes]);
    sound.playChime(1.4);
    fireHeartConfetti();

    setWishText('');
    setAuthorName('');
  };

  return (
    <div id="wish-jar-zone" className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 bg-white border-8 border-yellow-400 shadow-[14px_14px_0px_rgba(253,224,71,0.5)] overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-amber-900 text-xs font-black border-2 border-yellow-300 mb-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Enchanted Birthday Wish Jar
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-pink-600 leading-tight">
          Magical Blessings & Wishes for {bestieName} ⭐
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1">
          Drop a heartfelt blessing into the glowing glass jar. Each wish turns into an enchanted floating star!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Wish Input Form (Left 5 cols) */}
        <div className="lg:col-span-5 bg-yellow-50 p-5 sm:p-6 rounded-3xl border-4 border-yellow-300 shadow-[8px_8px_0px_rgba(251,191,36,0.4)]">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4">
            <MessageSquareHeart className="w-5 h-5 text-pink-500" />
            Make a Blessing / Dua / Wish
          </h3>

          <form onSubmit={handleSubmitWish} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-800 font-bold mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Your Bestie / Chum"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-pink-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">
                Birthday Wish / Message
              </label>
              <textarea
                rows={3}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Write whatever you pray and wish for your bestie on their special day..."
                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-pink-500 resize-none shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">
                Pick Origami Star Color
              </label>
              <div className="flex gap-2.5">
                {starColors.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setSelectedStarColor(c)}
                    className={`w-8 h-8 rounded-full transition transform border-2 border-white ${
                      selectedStarColor === c ? 'scale-125 ring-3 ring-pink-500 shadow-md' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition"
            >
              <Send className="w-4 h-4" />
              <span>Drop Wish into Jar ✨</span>
            </button>
          </form>
        </div>

        {/* Wish Jar & Stars (Right 7 cols) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Glass Jar Graphic */}
          <div className="relative w-56 sm:w-64 h-80 rounded-b-[2rem] rounded-t-2xl bg-cyan-50 border-4 border-cyan-400 shadow-[8px_8px_0px_rgba(34,211,238,0.4)] p-4 flex flex-col justify-between overflow-hidden">
            {/* Wooden Lid */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 rounded-t-lg bg-amber-700 border-2 border-amber-800 shadow-md flex items-center justify-center">
              <div className="w-16 h-1 bg-amber-300 rounded-full" />
            </div>

            {/* Glass Neck */}
            <div className="w-full h-3 border-b-2 border-cyan-300 -mt-1" />

            {/* Floating Stars Inside Jar */}
            <div className="relative flex-1 flex flex-wrap items-center justify-center gap-3 p-2 overflow-y-auto">
              {wishes.map((w, idx) => (
                <motion.div
                  key={w.id}
                  animate={{
                    y: [0, (idx % 2 === 0 ? -8 : 8), 0],
                    rotate: [0, (idx % 2 === 0 ? 15 : -15), 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + (idx % 4) * 0.5,
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => setActiveWishDetail(w)}
                  className="cursor-pointer p-1.5 rounded-full shadow-md"
                  style={{
                    filter: `drop-shadow(0 0 6px ${w.starColor})`,
                  }}
                  title={`Wish from ${w.author}`}
                >
                  <Star
                    className="w-7 h-7 sm:w-8 sm:h-8 fill-current"
                    style={{ color: w.starColor }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Jar Base Glowing label */}
            <div className="text-center pt-2 border-t-2 border-cyan-200">
              <span className="text-[10px] font-mono uppercase font-black text-cyan-800 tracking-wider">
                {wishes.length} Glowing Wishes Preserved
              </span>
            </div>
          </div>

          {/* List of Recent Blessings */}
          <div className="flex-1 w-full max-h-80 overflow-y-auto space-y-2.5 pr-1">
            {wishes.map((wish) => (
              <div
                key={wish.id}
                onClick={() => setActiveWishDetail(wish)}
                className="p-3.5 rounded-2xl bg-yellow-50 border-2 border-yellow-300 hover:border-pink-400 cursor-pointer transition flex items-start gap-3 text-left shadow-xs"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-200"
                  style={{
                    backgroundColor: `${wish.starColor}35`,
                    color: wish.starColor,
                  }}
                >
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate">
                      {wish.author}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{wish.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-bold mt-0.5 line-clamp-2">
                    {wish.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wish Detail Modal */}
      <AnimatePresence>
        {activeWishDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-8 border-pink-400 rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl text-center"
            >
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg"
                style={{
                  backgroundColor: `${activeWishDetail.starColor}20`,
                  color: activeWishDetail.starColor,
                }}
              >
                <Star className="w-8 h-8 fill-current animate-pulse" />
              </div>

              <span className="text-xs font-black text-pink-600 uppercase tracking-widest">
                BLESSING FROM {activeWishDetail.author}
              </span>

              <p className="mt-4 text-lg sm:text-xl font-handwriting text-slate-900 font-bold leading-relaxed">
                "{activeWishDetail.text}"
              </p>

              <button
                onClick={() => setActiveWishDetail(null)}
                className="mt-6 px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black text-xs shadow-lg cursor-pointer"
              >
                Close Blessing 💖
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
