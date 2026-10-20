import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, CheckCircle2, RotateCcw, Copy, Check } from 'lucide-react';
import { CouponItem } from '../types';
import { sound } from '../utils/audio';
import { fireSideCannons } from '../utils/confetti';

interface BalloonPopGameProps {
  bestieName: string;
  coupons: CouponItem[];
  onUpdateCoupons: (coupons: CouponItem[]) => void;
}

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({
  bestieName,
  coupons,
  onUpdateCoupons,
}) => {
  const [poppedMap, setPoppedMap] = useState<Record<string, boolean>>({});
  const [activeModalCoupon, setActiveModalCoupon] = useState<CouponItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const balloonColors = [
    { bg: 'from-pink-500 to-rose-600', shadow: '#f43f5e', border: '#fda4af' },
    { bg: 'from-purple-500 to-indigo-600', shadow: '#a855f7', border: '#d8b4fe' },
    { bg: 'from-amber-400 to-orange-500', shadow: '#f59e0b', border: '#fde68a' },
    { bg: 'from-cyan-400 to-blue-600', shadow: '#06b6d4', border: '#a5f3fc' },
    { bg: 'from-emerald-400 to-teal-600', shadow: '#10b981', border: '#a7f3d0' },
    { bg: 'from-fuchsia-500 to-pink-600', shadow: '#d946ef', border: '#f5d0fe' },
  ];

  const handlePop = (coupon: CouponItem, index: number) => {
    if (poppedMap[coupon.id]) return;

    sound.playBalloonPop();
    sound.playChime(1.3);

    setPoppedMap((prev) => ({ ...prev, [coupon.id]: true }));
    setActiveModalCoupon(coupon);

    const updated = coupons.map((c) =>
      c.id === coupon.id ? { ...c, isUnlocked: true } : c
    );
    onUpdateCoupons(updated);

    // If all popped
    if (Object.keys(poppedMap).length + 1 >= coupons.length) {
      fireSideCannons();
    }
  };

  const resetBalloons = () => {
    sound.playChime(1.1);
    setPoppedMap({});
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const poppedCount = Object.values(poppedMap).filter(Boolean).length;

  return (
    <div id="balloon-pop-zone" className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 bg-white border-8 border-yellow-400 shadow-[14px_14px_0px_rgba(253,224,71,0.5)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-amber-900 text-xs font-black border-2 border-yellow-300 mb-2">
            <Gift className="w-4 h-4 text-pink-500" />
            Pop & Unlock Birthday Vouchers
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-pink-600 leading-tight">
            Balloon Popping Surprise Frenzy 🎈
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1">
            Tap or click floating balloons to POP them and unlock exclusive treats for {bestieName}! ({poppedCount}/{coupons.length} Popped)
          </p>
        </div>

        <button
          onClick={resetBalloons}
          className="px-5 py-3 rounded-full bg-yellow-100 hover:bg-yellow-200 text-slate-900 text-xs font-black border-2 border-yellow-400 flex items-center gap-2 cursor-pointer transition active:scale-95 self-start sm:self-auto shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Inflate Balloons Again</span>
        </button>
      </div>

      {/* Floating Balloons Stage */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 items-center justify-items-center py-6 min-h-[300px]">
        {coupons.map((coupon, idx) => {
          const isPopped = poppedMap[coupon.id];
          const colorTheme = balloonColors[idx % balloonColors.length];

          return (
            <div key={coupon.id} className="relative flex flex-col items-center">
              <AnimatePresence mode="wait">
                {!isPopped ? (
                  <motion.div
                    key="balloon"
                    animate={{
                      y: [0, -18, 0],
                      x: [0, (idx % 2 === 0 ? 6 : -6), 0],
                      rotate: [0, (idx % 2 === 0 ? 4 : -4), 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + (idx % 3) * 0.8,
                      ease: 'easeInOut',
                      delay: idx * 0.2,
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePop(coupon, idx)}
                    className="relative cursor-pointer group select-none"
                  >
                    {/* Balloon Oval Body */}
                    <div
                      className={`w-24 sm:w-28 h-32 sm:h-36 rounded-full bg-gradient-to-tr ${colorTheme.bg} shadow-lg relative flex flex-col items-center justify-center p-3 text-center border-3 border-white group-hover:shadow-[0_0_25px_var(--shadow-color)]`}
                      style={{
                        boxShadow: `0 10px 25px ${colorTheme.shadow}80`,
                      }}
                    >
                      {/* Glossy light reflection highlight */}
                      <div className="absolute top-3 left-3 w-5 h-8 bg-white/50 rounded-full transform -rotate-35 blur-[1px]" />

                      <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">🎁</span>
                      <span className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider leading-tight drop-shadow-md">
                        POP ME!
                      </span>
                      <span className="text-[10px] text-white font-black mt-0.5">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Balloon Knot */}
                    <div
                      className="w-3.5 h-2.5 mx-auto -mt-0.5 rounded-b-sm bg-rose-700 border-x border-b border-white shadow-sm"
                      style={{ backgroundColor: colorTheme.shadow }}
                    />

                    {/* Balloon String */}
                    <div className="w-1 h-16 sm:h-20 bg-slate-400 mx-auto transform origin-top group-hover:rotate-6 transition-transform" />
                  </motion.div>
                ) : (
                  /* Revealed Unlocked Mini Voucher Card */
                  <motion.div
                    key="unlocked-card"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    onClick={() => setActiveModalCoupon(coupon)}
                    className="w-28 sm:w-32 p-3.5 rounded-2xl bg-yellow-50 border-3 border-yellow-400 shadow-md cursor-pointer flex flex-col items-center text-center hover:scale-105 transition"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                    <span className="text-[10px] font-black text-pink-600 uppercase tracking-wide">
                      UNLOCKED
                    </span>
                    <p className="text-xs font-black text-slate-800 mt-1 line-clamp-2 leading-tight">
                      {coupon.title}
                    </p>
                    <span className="text-[10px] font-black text-blue-600 mt-2 underline">
                      View Voucher
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Pop Reveal Voucher Modal */}
      <AnimatePresence>
        {activeModalCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="relative max-w-md w-full rounded-[2.5rem] bg-white border-8 border-pink-400 p-6 sm:p-8 shadow-[16px_16px_0px_rgba(244,114,182,0.4)] text-center overflow-hidden"
            >
              {/* Vibrant Ribbon Banner */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-black uppercase tracking-wider mb-4 border-2 border-pink-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                OFFICIAL BESTIE BIRTHDAY COUPON
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-display text-pink-600 leading-tight">
                {activeModalCoupon.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-slate-700 font-bold leading-relaxed">
                {activeModalCoupon.description}
              </p>

              {/* Coupon Redemption Box */}
              <div className="mt-6 p-4 rounded-2xl bg-yellow-50 border-3 border-dashed border-yellow-400 flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] text-slate-600 uppercase font-black block">
                    Voucher Passcode (No Expiry)
                  </span>
                  <span className="font-mono text-sm sm:text-base font-black text-pink-600">
                    {activeModalCoupon.code}
                  </span>
                </div>

                <button
                  onClick={() => copyVoucherCode(activeModalCoupon.code)}
                  className="px-4 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-md"
                >
                  {copiedCode === activeModalCoupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setActiveModalCoupon(null)}
                  className="w-full py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm shadow-lg border-2 border-yellow-500 cursor-pointer active:scale-95 transition"
                >
                  Redeem Later & Pop More Balloons! 🎉
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
