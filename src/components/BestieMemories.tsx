import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Plus, Sparkles, Heart, RotateCw, Image as ImageIcon, Trash2, X, Check } from 'lucide-react';
import { BestiePhoto } from '../types';
import { sound } from '../utils/audio';
import { fireHeartConfetti } from '../utils/confetti';

interface BestieMemoriesProps {
  bestieName: string;
  photos: BestiePhoto[];
  onUpdatePhotos: (photos: BestiePhoto[]) => void;
}

export const BestieMemories: React.FC<BestieMemoriesProps> = ({
  bestieName,
  photos,
  onUpdatePhotos,
}) => {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newBackNote, setNewBackNote] = useState('');
  const [newSticker, setNewSticker] = useState('💖');

  const stickers = ['👑', '💖', '🥳', '✨', '🍕', '🕶️', '🌸', '🔥', '💃', '🧁'];

  const toggleFlip = (id: string) => {
    sound.playChime(1.2);
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setNewPhotoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newPhoto: BestiePhoto = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl,
      caption: newCaption.trim() || 'Unforgettable Bestie Moment ✨',
      date: newDate.trim() || 'Forever Favorite',
      rotation: (Math.random() - 0.5) * 8,
      sticker: newSticker,
      backNote: newBackNote.trim() || 'Best memories with the greatest human!',
    };

    onUpdatePhotos([...photos, newPhoto]);
    sound.playChime(1.4);
    fireHeartConfetti();

    // Reset
    setNewPhotoUrl('');
    setNewCaption('');
    setNewDate('');
    setNewBackNote('');
    setIsAddModalOpen(false);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdatePhotos(photos.filter((p) => p.id !== id));
  };

  return (
    <div id="polaroid-memories" className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 bg-white border-8 border-blue-400 shadow-[14px_14px_0px_rgba(96,165,250,0.5)] overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-black border-2 border-blue-300 mb-2">
            <Camera className="w-4 h-4 text-blue-600" />
            Polaroid Memory Wall & Snapshots
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-blue-600 leading-tight">
            Memory Lane with {bestieName} 📸
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1">
            Click any polaroid to flip and read the secret back note!
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-black shadow-lg border-2 border-pink-400 flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Memory / Photo</span>
        </button>
      </div>

      {/* Polaroid Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
        {photos.map((photo) => {
          const isFlipped = flippedCardId === photo.id;

          return (
            <motion.div
              key={photo.id}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
              style={{ rotate: `${photo.rotation}deg` }}
              onClick={() => toggleFlip(photo.id)}
              className="relative bg-yellow-50 text-slate-900 rounded-3xl p-4 pb-6 shadow-[8px_8px_0px_rgba(251,191,36,0.5)] border-4 border-yellow-300 cursor-pointer group transition-all duration-300 select-none"
            >
              {/* Realistic masking tape on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/80 border-2 border-pink-300 rounded-md shadow-sm transform -rotate-2 z-10 pointer-events-none" />

              {/* Decorative Sticker Badge */}
              {photo.sticker && (
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white shadow-md border-2 border-pink-300 flex items-center justify-center text-lg z-10 transform rotate-12">
                  {photo.sticker}
                </div>
              )}

              {/* Front vs Back View */}
              {!isFlipped ? (
                <div className="flex flex-col">
                  {/* Photo Frame */}
                  <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback image if broken url
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  {/* Polaroid Handwritten Caption */}
                  <div className="mt-4 px-1 flex flex-col justify-between min-h-[52px]">
                    <p className="font-handwriting text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                      {photo.caption}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600 font-mono font-bold">
                      <span>{photo.date || 'Best Day Ever'}</span>
                      <span className="text-pink-600 font-sans font-black flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <RotateCw className="w-3.5 h-3.5" /> Flip note
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Back of Polaroid */
                <div className="aspect-square w-full p-4 rounded-2xl bg-white border-2 border-pink-300 shadow-inner flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-pink-700 font-black border-b-2 border-pink-200 pb-1">
                    <span>💌 SECRET NOTE</span>
                    <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                  </div>

                  <p className="font-handwriting text-2xl font-bold text-pink-900 leading-relaxed my-auto text-center">
                    "{photo.backNote || 'You make every memory 100x more special! ❤️'}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t-2 border-pink-200 text-[11px] text-slate-600 font-bold">
                    <span>Click to flip back</span>
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="text-rose-600 hover:text-rose-800 p-1 font-sans font-black flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-8 border-pink-400 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-[16px_16px_0px_rgba(244,114,182,0.4)]"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-pink-200">
                <h3 className="text-xl font-black font-display text-pink-600 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  Add Bestie Memory Polaroid
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-xl text-slate-500 hover:text-slate-900 bg-pink-50 hover:bg-pink-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPhoto} className="mt-4 space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Upload Image or Paste Image URL
                  </label>
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-pink-50 border-2 border-pink-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500 mb-2"
                  />
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-pink-400 hover:border-pink-600 bg-pink-50 cursor-pointer text-pink-700 font-bold text-xs transition">
                    <ImageIcon className="w-4 h-4 text-pink-500" />
                    <span>Upload from Device Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Polaroid Caption
                  </label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="e.g. Eating pani puri till we exploded! 😂"
                    className="w-full px-3 py-2 rounded-xl bg-pink-50 border-2 border-pink-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Secret Back Note (Reveals when flipped)
                  </label>
                  <input
                    type="text"
                    value={newBackNote}
                    onChange={(e) => setNewBackNote(e.target.value)}
                    placeholder="e.g. I knew right then you were my forever friend! ❤️"
                    className="w-full px-3 py-2 rounded-xl bg-pink-50 border-2 border-pink-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Sticker Selection */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Choose Corner Sticker
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {stickers.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewSticker(s)}
                        className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-lg transition cursor-pointer ${
                          newSticker === s
                            ? 'bg-pink-500 border-pink-600 scale-110 shadow-md'
                            : 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 border border-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black flex items-center justify-center gap-1.5 shadow-lg border-2 border-pink-400 cursor-pointer transition active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Polaroid</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
