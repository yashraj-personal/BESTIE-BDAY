import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { initialBestieConfig } from './data/defaultConfig';
import { BestieConfig } from './types';
import { GrandCurtain } from './components/GrandCurtain';
import { WelcomeHero } from './components/WelcomeHero';
import { FirecrackerShow } from './components/FirecrackerShow';
import { BirthdayCake } from './components/BirthdayCake';
import { BestieMemories } from './components/BestieMemories';
import { BalloonPopGame } from './components/BalloonPopGame';
import { GoldenScratchCard } from './components/GoldenScratchCard';
import { MysteryGiftBox } from './components/MysteryGiftBox';
import { WishJar } from './components/WishJar';
import { BestieReportCard } from './components/BestieReportCard';
import { PersonalizerModal } from './components/PersonalizerModal';
import { MusicDJBar } from './components/MusicDJBar';
import { Sparkles, Heart, Crown } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<BestieConfig>(() => {
    // Try URL hash first
    try {
      const hash = window.location.hash;
      if (hash.includes('#bday=')) {
        const encoded = hash.split('#bday=')[1];
        const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
        const parsed = JSON.parse(jsonStr);
        return {
          ...initialBestieConfig,
          bestieName: parsed.n || initialBestieConfig.bestieName,
          nickname: parsed.nk || initialBestieConfig.nickname,
          senderName: parsed.s || initialBestieConfig.senderName,
          age: parsed.a || initialBestieConfig.age,
          customTitle: parsed.t || initialBestieConfig.customTitle,
          heartfeltLetter: parsed.l || initialBestieConfig.heartfeltLetter,
        };
      }
    } catch {}

    // Try LocalStorage
    try {
      const saved = localStorage.getItem('bestie_bday_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    return initialBestieConfig;
  });

  const [curtainOpen, setCurtainOpen] = useState(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [partyMode, setPartyMode] = useState(false);

  // Save to localStorage when config changes
  useEffect(() => {
    try {
      localStorage.setItem('bestie_bday_config', JSON.stringify(config));
    } catch {}
  }, [config]);

  const handleUpdateConfig = (newConfig: BestieConfig) => {
    setConfig(newConfig);
  };

  const handleResetDefaults = () => {
    setConfig(initialBestieConfig);
    try {
      localStorage.removeItem('bestie_bday_config');
    } catch {}
    setIsCustomizerOpen(false);
  };

  const jumpToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen bg-yellow-50 text-slate-900 relative selection:bg-pink-500 selection:text-white transition-colors duration-700 overflow-x-hidden ${partyMode ? 'party-mode-active' : ''}`}>
      {/* 1. Grand Theatrical Velvet Curtain Reveal */}
      <GrandCurtain
        bestieName={config.bestieName}
        nickname={config.nickname}
        isOpen={curtainOpen}
        onOpen={() => setCurtainOpen(true)}
      />

      {/* Ambient background playful confetti & glowing circles (Vibrant Palette) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute top-12 left-16 w-24 h-24 rounded-full bg-pink-400/40 blur-xl animate-pulse" />
        <div className="absolute top-36 right-24 w-32 h-32 rounded-full bg-purple-400/35 blur-xl" />
        <div className="absolute top-1/3 left-1/4 text-5xl opacity-40 transform -rotate-12 animate-bounce">✨</div>
        <div className="absolute top-1/4 right-1/4 text-5xl opacity-40 transform rotate-12">🎉</div>
        <div className="absolute bottom-1/3 left-16 w-28 h-28 rounded-full bg-blue-400/35 blur-xl" />
        <div className="absolute bottom-24 right-1/3 w-36 h-36 rounded-full bg-yellow-300/60 blur-xl" />
        <div className="absolute bottom-1/4 right-16 text-5xl opacity-40">🍰</div>
        <div className="absolute top-2/3 left-1/3 text-4xl opacity-35 transform rotate-6">🎁</div>
        <div className="absolute top-1/2 right-12 w-20 h-20 rounded-full bg-green-400/30 blur-xl" />
      </div>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 pb-32">
        {/* Top Floating Notification Badge (Vibrant Palette) */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-pink-700 bg-white px-6 py-2.5 rounded-full border-4 border-pink-400 max-w-md mx-auto shadow-[6px_6px_0px_rgba(244,114,182,0.4)]">
          <span className="flex items-center gap-2 font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-pink-500 animate-spin" />
            Vibrant Bestie Birthday Gala
          </span>
          <span className="font-mono font-black text-pink-600 bg-pink-100 px-3 py-0.5 rounded-full">
            For {config.bestieName} 💖
          </span>
        </div>

        {/* 2. Welcome & Hero Stage */}
        <WelcomeHero
          bestieName={config.bestieName}
          nickname={config.nickname}
          age={config.age}
          customTitle={config.customTitle}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onJumpToSection={jumpToSection}
        />

        {/* 3. Realistic Firecracker & Fireworks Canvas Show */}
        <FirecrackerShow />

        {/* 4. Interactive 3D Birthday Cake & Candle Wish */}
        <BirthdayCake
          bestieName={config.bestieName}
          age={config.age}
        />

        {/* 5. Polaroid Memory Lane Wall */}
        <BestieMemories
          bestieName={config.bestieName}
          photos={config.photos}
          onUpdatePhotos={(newPhotos) =>
            setConfig((prev) => ({ ...prev, photos: newPhotos }))
          }
        />

        {/* 6. Balloon Popping Frenzy & Secret Coupons */}
        <BalloonPopGame
          bestieName={config.bestieName}
          coupons={config.coupons}
          onUpdateCoupons={(newCoupons) =>
            setConfig((prev) => ({ ...prev, coupons: newCoupons }))
          }
        />

        {/* 7. Golden Scratch Card with Secret Letter */}
        <GoldenScratchCard
          bestieName={config.bestieName}
          senderName={config.senderName}
          letterText={config.heartfeltLetter}
        />

        {/* 8. 3D Mystery Gift Unboxing Box */}
        <MysteryGiftBox
          bestieName={config.bestieName}
        />

        {/* 9. Enchanted Wish Jar */}
        <WishJar
          bestieName={config.bestieName}
        />

        {/* 10. Official Bestie Diploma & Report Card */}
        <BestieReportCard
          bestieName={config.bestieName}
          senderName={config.senderName}
          age={config.age}
          superlatives={config.superlatives}
        />

        {/* Footer Greetings (Vibrant Palette) */}
        <footer className="text-center pt-10 border-t-4 border-pink-300 text-slate-700 text-xs sm:text-sm space-y-4">
          <div className="flex justify-center space-x-3">
            <div className="h-3.5 w-3.5 rounded-full bg-pink-400 shadow-sm animate-bounce" />
            <div className="h-3.5 w-3.5 rounded-full bg-yellow-400 shadow-sm animate-bounce" style={{ animationDelay: '0.15s' }} />
            <div className="h-3.5 w-3.5 rounded-full bg-blue-400 shadow-sm animate-bounce" style={{ animationDelay: '0.3s' }} />
            <div className="h-3.5 w-3.5 rounded-full bg-purple-400 shadow-sm animate-bounce" style={{ animationDelay: '0.45s' }} />
          </div>

          <p className="flex items-center justify-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
            Made with infinite love for{' '}
            <span className="text-pink-600 font-black underline decoration-yellow-400 decoration-wavy">{config.bestieName}</span> by{' '}
            <span className="text-purple-700 font-black">{config.senderName}</span> 💖
          </p>
          <p className="text-slate-600 text-xs font-semibold">
            Happy Birthday Bestie • “You aren’t just a friend, you are the family I chose!” 🎉🍰✨
          </p>
        </footer>
      </main>

      {/* Floating Bottom DJ Toolbar */}
      <MusicDJBar
        partyMode={partyMode}
        onTogglePartyMode={() => setPartyMode(!partyMode)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onReopenCurtain={() => setCurtainOpen(false)}
      />

      {/* Personalizer Modal */}
      <PersonalizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSaveConfig={handleUpdateConfig}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
