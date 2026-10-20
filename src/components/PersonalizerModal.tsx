import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Wand2, Share2, Copy, RefreshCw, Heart, Sparkles, User, Calendar } from 'lucide-react';
import { BestieConfig } from '../types';
import { sound } from '../utils/audio';
import { fireGrandConfetti } from '../utils/confetti';

interface PersonalizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BestieConfig;
  onSaveConfig: (newConfig: BestieConfig) => void;
  onResetDefaults: () => void;
}

export const PersonalizerModal: React.FC<PersonalizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<BestieConfig>({ ...config });
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    sound.playCelebrationFanfare();
    fireGrandConfetti();
    onClose();
  };

  const handleShareLink = () => {
    try {
      const dataToEncode = {
        n: formData.bestieName,
        nk: formData.nickname,
        s: formData.senderName,
        a: formData.age,
        t: formData.customTitle,
        l: formData.heartfeltLetter,
      };
      const jsonStr = JSON.stringify(dataToEncode);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
      const shareUrl = `${window.location.origin}${window.location.pathname}#bday=${encoded}`;

      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      sound.playChime(1.4);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white border-8 border-pink-400 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full shadow-[16px_16px_0px_rgba(244,114,182,0.4)] my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-pink-200">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-pink-600">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-pink-600">
                    Personalize Bestie Celebration (કસ્ટમાઇઝ કરો)
                  </h3>
                  <p className="text-xs text-slate-600 font-bold">
                    Change names, age, custom message & generate direct shareable link!
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Bestie's Real Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.bestieName}
                      onChange={(e) =>
                        setFormData({ ...formData, bestieName: e.target.value })
                      }
                      placeholder="e.g. Pari / Aastha / Harsh"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Funny Nickname / Vibe
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    placeholder="e.g. Chirkut / Drama Queen 👑"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Age Turning
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="number"
                      min={1}
                      max={120}
                      required
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: parseInt(e.target.value) || 21 })
                      }
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Your Name (Sender)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.senderName}
                    onChange={(e) =>
                      setFormData({ ...formData, senderName: e.target.value })
                    }
                    placeholder="e.g. Your Forever Bestie"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Tagline / Special Title
                </label>
                <input
                  type="text"
                  value={formData.customTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, customTitle: e.target.value })
                  }
                  placeholder="e.g. The Craziest & Most Precious Human on Earth"
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Heartfelt Secret Letter (Scratch Card)
                </label>
                <textarea
                  rows={4}
                  value={formData.heartfeltLetter}
                  onChange={(e) =>
                    setFormData({ ...formData, heartfeltLetter: e.target.value })
                  }
                  placeholder="Write your long emotional or hilarious message to your bestie..."
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-500 resize-none font-mono text-xs shadow-xs"
                />
              </div>

              {/* Share link quick box */}
              <div className="p-4 rounded-2xl bg-yellow-50 border-3 border-yellow-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div className="text-left">
                  <span className="text-xs font-black text-pink-600 block flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    Direct Shareable WhatsApp / Instagram Link
                  </span>
                  <span className="text-[11px] text-slate-700 font-bold">
                    Sends your bestie directly to this personalized celebration!
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleShareLink}
                  className="px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow active:scale-95 transition"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Share Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 cursor-pointer border border-slate-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Default</span>
                </button>

                <div className="flex-1 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-black hover:bg-slate-200 cursor-pointer border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black flex items-center gap-2 shadow-lg border-2 border-yellow-500 cursor-pointer active:scale-95 transition"
                  >
                    <Check className="w-4 h-4 text-pink-600" />
                    <span>Apply Changes 🎉</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
