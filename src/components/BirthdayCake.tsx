import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Wind, Sparkles, Utensils, Heart, RefreshCw, Mic, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { fireGrandConfetti, fireHeartConfetti } from '../utils/confetti';

interface BirthdayCakeProps {
  bestieName: string;
  age: number;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ bestieName, age }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [cakeFlavor, setCakeFlavor] = useState<'strawberry' | 'chocolate' | 'vanilla' | 'rainbow'>('strawberry');
  const [isCut, setIsCut] = useState(false);
  const [slicesFed, setSlicesFed] = useState(0);
  const [feedReaction, setFeedReaction] = useState<string | null>(null);
  const [micActive, setMicActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micIntervalRef = useRef<number | null>(null);

  const flavorThemes = {
    strawberry: {
      top: 'bg-rose-400',
      middle: 'bg-rose-300',
      bottom: 'bg-pink-500',
      frosting: 'bg-pink-100',
      drips: 'bg-pink-200',
      border: 'border-pink-300',
      textColor: 'text-rose-900',
      name: 'Strawberry Velvet 🍓',
    },
    chocolate: {
      top: 'bg-amber-900',
      middle: 'bg-amber-800',
      bottom: 'bg-amber-950',
      frosting: 'bg-amber-200',
      drips: 'bg-amber-600',
      border: 'border-amber-700',
      textColor: 'text-amber-100',
      name: 'Chocolate Truffle 🍫',
    },
    vanilla: {
      top: 'bg-amber-100',
      middle: 'bg-amber-200',
      bottom: 'bg-yellow-300',
      frosting: 'bg-white',
      drips: 'bg-amber-300',
      border: 'border-amber-300',
      textColor: 'text-amber-900',
      name: 'Golden Vanilla 🍯',
    },
    rainbow: {
      top: 'bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400',
      middle: 'bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300',
      bottom: 'bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500',
      frosting: 'bg-white',
      drips: 'bg-purple-200',
      border: 'border-purple-300',
      textColor: 'text-purple-900',
      name: 'Rainbow Fiesta 🌈',
    },
  };

  const currentTheme = flavorThemes[cakeFlavor];

  // Number of candles to render (default 5 decorative candles or age)
  const candleCount = Math.min(Math.max(5, age > 0 ? Math.min(age, 9) : 5), 7);

  // Handle Blow Candles
  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setIsBlowing(true);
    sound.playCandleBlow();

    setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
      sound.playCelebrationFanfare();
      fireGrandConfetti();
      fireHeartConfetti();
    }, 450);
  };

  // Re-light candles
  const handleRelight = () => {
    sound.playChime(1.1);
    setCandlesLit(true);
    setIsCut(false);
  };

  // Cut the cake
  const handleCutCake = () => {
    sound.playChime(1.4);
    setIsCut(true);
    fireHeartConfetti();
  };

  // Feed slice to bestie
  const handleFeedSlice = () => {
    sound.playChime(1.5);
    const newCount = slicesFed + 1;
    setSlicesFed(newCount);

    const reactions = [
      `"Mmmm! Delicious! You're the sweetest bestie in the world! 🎂❤️"`,
      `"Diet starts tomorrow, today is for pure sugar rush! 😋✨"`,
      `"Save the cherry on top for me! Best cake ever! 🍒"`,
      `"One more bite for everlasting best friendship! 🍰👭"`,
      `"Virtual calories don't count anyway, gimme another slice! 😂"`,
    ];
    setFeedReaction(reactions[(newCount - 1) % reactions.length]);
  };

  // Optional Microphone blow detection
  const toggleMicDetection = async () => {
    if (micActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      setMicActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setMicActive(true);

      micIntervalRef.current = window.setInterval(() => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        // If high breath/blow volume detected
        if (average > 55 && candlesLit) {
          handleBlowCandles();
        }
      }, 100);
    } catch {
      alert('Microphone access not available. You can click the "Blow Candles" button directly!');
      setMicActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
    };
  }, []);

  return (
    <div id="birthday-cake-zone" className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 bg-white border-8 border-yellow-400 shadow-[14px_14px_0px_rgba(253,224,71,0.5)] overflow-hidden">
      {/* Background glowing aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300/30 blur-3xl pointer-events-none rounded-full" />

      {/* Header section */}
      <div className="relative z-10 text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-black border-2 border-pink-300 mb-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Interactive Birthday Cake & Candle Wish
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display text-pink-600 vibrant-text-shadow-pink leading-tight">
          Make a Birthday Wish, {bestieName}! 🎂
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-bold mt-2">
          {candlesLit
            ? 'Blow out the glowing candles to make all your dreams come true!'
            : '✨ Candles blown! Now cut the cake & share a delicious slice! ✨'}
        </p>

        {/* Flavor Selector */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          {(['strawberry', 'chocolate', 'vanilla', 'rainbow'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setCakeFlavor(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition cursor-pointer ${
                cakeFlavor === f
                  ? 'bg-pink-500 text-white border-pink-600 shadow-md scale-105'
                  : 'bg-yellow-100 text-slate-800 border-yellow-300 hover:bg-yellow-200'
              }`}
            >
              {flavorThemes[f].name}
            </button>
          ))}
        </div>
      </div>

      {/* Cake Stage */}
      <div className="relative flex flex-col items-center justify-center min-h-[360px] z-10">
        {/* Cake Structure */}
        <div className="relative flex flex-col items-center">
          {/* Candles Row */}
          <div className="flex items-end justify-center gap-3 sm:gap-6 mb-1 z-20">
            {[...Array(candleCount)].map((_, i) => (
              <div key={i} className="relative flex flex-col items-center">
                {/* Flame / Smoke */}
                <div className="h-9 flex items-center justify-center">
                  <AnimatePresence>
                    {candlesLit ? (
                      <motion.div
                        key="flame"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-4 h-7 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_20px_#ff9900] animate-flame origin-bottom"
                      >
                        <div className="w-1.5 h-3 bg-white/90 rounded-full mx-auto mt-2 blur-[0.5px]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="smoke"
                        initial={{ opacity: 0.8, y: 0, scale: 0.8 }}
                        animate={{ opacity: 0, y: -24, scale: 1.8 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="w-3 h-3 rounded-full bg-slate-300/60 blur-[1px]"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-slate-800" />

                {/* Candle Stick */}
                <div
                  className={`w-3 sm:w-3.5 h-12 sm:h-14 rounded-t-sm shadow-md border border-white/30 ${
                    i % 2 === 0
                      ? 'bg-gradient-to-b from-rose-300 via-pink-400 to-rose-500'
                      : 'bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-400'
                  }`}
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Top Layer (Smallest) */}
          <div
            className={`relative w-44 sm:w-56 h-14 rounded-t-2xl ${currentTheme.top} border-t-2 border-x-2 ${currentTheme.border} shadow-lg flex items-center justify-center`}
          >
            {/* Frosting Drips */}
            <div className="absolute top-0 inset-x-0 h-4 flex justify-around">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-4 ${currentTheme.frosting} rounded-b-full shadow-sm`}
                />
              ))}
            </div>
            <span className={`font-handwriting text-lg sm:text-xl font-bold ${currentTheme.textColor} z-10 mt-1`}>
              Happy {age}th Birthday!
            </span>
          </div>

          {/* Middle Layer */}
          <div
            className={`relative w-60 sm:w-72 h-16 ${currentTheme.middle} border-x-2 ${currentTheme.border} shadow-md flex items-center justify-center`}
          >
            {/* Cream Border Pipings */}
            <div className="absolute top-0 inset-x-0 h-3 bg-white/70 flex justify-between px-2">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
              ))}
            </div>
            <div className="flex items-center gap-2 z-10 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>👑 {bestieName} 👑</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
          </div>

          {/* Bottom Layer (Base) */}
          <div
            className={`relative w-72 sm:w-88 h-20 rounded-b-xl ${currentTheme.bottom} border-b-4 border-x-2 ${currentTheme.border} shadow-2xl flex items-center justify-around px-4`}
          >
            {/* Decorative Stars / Candies on bottom layer */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-amber-300/80 shadow-inner flex items-center justify-center text-[10px]"
              >
                ⭐
              </div>
            ))}

            {/* Cut line indicator if sliced */}
            {isCut && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                className="absolute top-0 right-16 w-1 bg-amber-200/90 shadow-[0_0_10px_#fff]"
              />
            )}
          </div>

          {/* Golden Platter / Cake Stand */}
          <div className="w-80 sm:w-96 h-5 rounded-full gold-trim shadow-2xl mt-1 border border-amber-300 flex items-center justify-center">
            <div className="w-64 h-1.5 bg-amber-900/30 rounded-full" />
          </div>
          {/* Cake Stand Pedestal */}
          <div className="w-24 h-6 bg-gradient-to-b from-amber-300 to-amber-600 rounded-b-2xl shadow-xl" />
        </div>

        {/* Served Cake Slice Popup when cut */}
        <AnimatePresence>
          {isCut && (
            <motion.div
              initial={{ scale: 0, opacity: 0, x: 80, y: -40 }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mt-6 p-5 rounded-[2rem] bg-pink-50 border-4 border-pink-400 shadow-[8px_8px_0px_rgba(244,114,182,0.4)] flex flex-col items-center text-center max-w-xs"
            >
              <div className="text-4xl mb-1 animate-bounce">🍰</div>
              <span className="text-xs font-black text-pink-700 uppercase tracking-wider">
                A Sweet Slice Just For You!
              </span>
              <p className="text-xs text-slate-700 font-bold mt-1">
                Virtual Slice #{slicesFed + 1} served fresh!
              </p>

              <button
                onClick={handleFeedSlice}
                className="mt-3 px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-black shadow-lg border-2 border-pink-400 flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Feed Slice to {bestieName} (બાઇટ ખવડાવો)</span>
              </button>

              {feedReaction && (
                <motion.p
                  key={feedReaction}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs font-handwriting text-pink-700 text-sm font-bold"
                >
                  {feedReaction}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Action Buttons */}
      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
        {candlesLit ? (
          <>
            <button
              id="blow-candle-btn"
              onClick={handleBlowCandles}
              disabled={isBlowing}
              className="px-8 py-3.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-black text-sm sm:text-base shadow-lg border-2 border-blue-400 flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-105 transition-all"
            >
              <Wind className="w-5 h-5 animate-pulse" />
              <span>BLOW CANDLES (મીણબત્તી ઓલવો) 💨</span>
            </button>

            <button
              onClick={toggleMicDetection}
              className={`px-5 py-3.5 rounded-full text-xs sm:text-sm font-bold border-2 flex items-center gap-2 transition cursor-pointer ${
                micActive
                  ? 'bg-red-500 border-red-600 text-white animate-pulse'
                  : 'bg-yellow-100 border-yellow-400 text-slate-800 hover:bg-yellow-200'
              }`}
              title="Blow air into your microphone to blow candles!"
            >
              <Mic className="w-4 h-4" />
              <span>{micActive ? 'Mic Blow Active (Blow now!)' : 'Use Microphone Blow'}</span>
            </button>
          </>
        ) : (
          <>
            {!isCut ? (
              <button
                id="cut-cake-btn"
                onClick={handleCutCake}
                className="px-8 py-3.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black text-sm sm:text-base shadow-xl border-2 border-pink-400 flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-105 transition-all"
              >
                <Utensils className="w-5 h-5" />
                <span>CUT THE CAKE (કેક કાપો) 🎂🔪</span>
              </button>
            ) : null}

            <button
              onClick={handleRelight}
              className="px-6 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 border-2 border-yellow-500 text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-105 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Re-light Candles & Celebrate Again</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
