import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles, PartyPopper, Disc, Wand2, Eye } from 'lucide-react';
import { sound } from '../utils/audio';
import { fireGrandConfetti, fireSideCannons } from '../utils/confetti';

interface MusicDJBarProps {
  partyMode: boolean;
  onTogglePartyMode: () => void;
  onOpenCustomizer: () => void;
  onReopenCurtain: () => void;
}

export const MusicDJBar: React.FC<MusicDJBarProps> = ({
  partyMode,
  onTogglePartyMode,
  onOpenCustomizer,
  onReopenCurtain,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentNote, setCurrentNote] = useState<string | null>(null);

  useEffect(() => {
    // Sync muted state
    setIsMuted(sound.getMuted());
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      sound.stopHappyBirthday();
      setIsPlaying(false);
      setCurrentNote(null);
    } else {
      sound.playHappyBirthday((noteName) => {
        setCurrentNote(noteName);
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (muted) {
      setIsPlaying(false);
    }
  };

  const handleConfettiBlast = () => {
    sound.playChime(1.3);
    fireGrandConfetti();
    fireSideCannons();
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto max-w-2xl w-full p-2.5 sm:p-3.5 rounded-full bg-white border-4 border-yellow-400 shadow-[8px_8px_0px_rgba(253,224,71,0.6)] flex items-center justify-between gap-2 text-slate-900"
      >
        {/* Left: Music Synth Status & Play/Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-md cursor-pointer border-2 ${
              isPlaying
                ? 'bg-pink-600 border-pink-400 text-white animate-pulse'
                : 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-slate-900'
            }`}
            title={isPlaying ? 'Pause Birthday Melody' : 'Play Happy Birthday Melody'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="hidden sm:flex flex-col text-left pr-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-pink-600">
              <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>Birthday Music Box</span>
            </div>
            <span className="text-[11px] text-slate-600 font-mono font-bold">
              {currentNote ? (
                <span className="text-pink-600 font-black animate-pulse">
                  ♪ {currentNote}
                </span>
              ) : isPlaying ? (
                'Playing tune...'
              ) : (
                'Click Play for BGM'
              )}
            </span>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Disco Party Mode */}
          <button
            onClick={onTogglePartyMode}
            className={`px-4 py-2 rounded-full text-xs font-black border-2 transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm ${
              partyMode
                ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_15px_#ec4899]'
                : 'bg-yellow-100 border-yellow-300 text-slate-900 hover:bg-yellow-200'
            }`}
            title="Toggle Disco Lights & Party Aura"
          >
            <Sparkles className={`w-4 h-4 ${partyMode ? 'animate-spin text-yellow-300' : 'text-pink-500'}`} />
            <span className="hidden sm:inline">{partyMode ? 'Disco ON ✨' : 'Party Mode'}</span>
          </button>

          {/* Quick Confetti Cannon */}
          <button
            onClick={handleConfettiBlast}
            className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 border-2 border-yellow-500 text-slate-950 font-black text-xs shadow hover:scale-105 active:scale-95 transition flex items-center gap-1 cursor-pointer"
            title="Fire Confetti & Fireworks Shower"
          >
            <PartyPopper className="w-4 h-4 text-pink-600" />
            <span>Blast 🎊</span>
          </button>

          {/* Curtains Re-view */}
          <button
            onClick={onReopenCurtain}
            className="p-2.5 sm:px-4 sm:py-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 border-2 border-pink-300 text-xs font-black flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            title="Re-close Velvet Curtains"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Re-open Curtain</span>
          </button>

          {/* Edit Bestie Modal Trigger */}
          <button
            onClick={onOpenCustomizer}
            className="p-2.5 sm:px-4 sm:py-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 border-2 border-blue-300 text-xs font-black flex items-center gap-1 cursor-pointer transition shadow-xs"
            title="Customize Name, Message, Photos"
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden md:inline">Edit</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2.5 rounded-full border-2 transition cursor-pointer shadow-xs ${
              isMuted
                ? 'bg-rose-100 border-rose-300 text-rose-600'
                : 'bg-yellow-100 border-yellow-300 text-slate-800 hover:bg-yellow-200'
            }`}
            title={isMuted ? 'Unmute All Sounds' : 'Mute Sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
