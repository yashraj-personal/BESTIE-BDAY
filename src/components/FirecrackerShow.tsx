import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Zap, Heart, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  trail?: { x: number; y: number }[];
  isSpark?: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  type: 'standard' | 'heart' | 'willow' | 'fountain' | 'ladi';
  exploded: boolean;
}

export const FirecrackerShow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [autoShow, setAutoShow] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [skyTheme, setSkyTheme] = useState<'midnight' | 'deep-purple' | 'aurora'>('midnight');

  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastAutoLaunchRef = useRef<number>(0);

  const colors = [
    '#ff0055', '#ff5050', '#ffcc00', '#00e5ff', '#a855f7',
    '#ffd700', '#ff69b4', '#10b981', '#f97316', '#38bdf8'
  ];

  // Helper to create blast particles
  const createExplosion = useCallback((x: number, y: number, color: string, type: string) => {
    if (soundEnabled) {
      if (type === 'ladi') {
        sound.playFireworkBoom('small');
      } else if (type === 'willow') {
        sound.playFireworkBoom('mega');
      } else {
        sound.playFireworkBoom('medium');
      }
    }

    if (type === 'heart') {
      const count = 70;
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count;
        // Parametric heart formula
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.28 + Math.random() * 0.05;

        particlesRef.current.push({
          x,
          y,
          vx: hx * speed,
          vy: hy * speed,
          alpha: 1,
          color: i % 2 === 0 ? '#ff1493' : '#ffd700',
          size: Math.random() * 3 + 2,
          decay: 0.014 + Math.random() * 0.006,
        });
      }
      return;
    }

    if (type === 'ladi') {
      // Rapid multiple mini bursts
      for (let burst = 0; burst < 12; burst++) {
        setTimeout(() => {
          if (soundEnabled && burst % 2 === 0) sound.playFireworkBoom('small');
          const offsetX = (Math.random() - 0.5) * 60;
          const offsetY = burst * 15;
          for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            particlesRef.current.push({
              x: x + offsetX,
              y: y + offsetY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: Math.random() > 0.5 ? '#ff3300' : '#ffe600',
              size: Math.random() * 2.5 + 1.5,
              decay: 0.035,
            });
          }
        }, burst * 90);
      }
      return;
    }

    // Standard / Willow fireworks
    const count = type === 'willow' ? 120 : 80;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = type === 'willow' ? Math.random() * 4 + 1 : Math.random() * 5 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: type === 'willow' ? '#ffd700' : color,
        size: Math.random() * 3 + 1.5,
        decay: type === 'willow' ? 0.009 : 0.018,
        isSpark: type === 'willow',
      });
    }
  }, [soundEnabled]);

  // Launch rocket function
  const launchRocket = useCallback((
    targetX?: number,
    targetY?: number,
    type: 'standard' | 'heart' | 'willow' | 'fountain' | 'ladi' = 'standard'
  ) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const startX = targetX !== undefined ? targetX : Math.random() * (canvas.width - 100) + 50;
    const destY = targetY !== undefined ? targetY : Math.random() * (canvas.height * 0.45) + 50;

    if (soundEnabled) {
      sound.playRocketLaunch();
    }

    if (type === 'fountain') {
      // Ground flowerpot fountain
      const fountainX = startX;
      const groundY = canvas.height - 20;
      for (let f = 0; f < 30; f++) {
        setTimeout(() => {
          for (let p = 0; p < 8; p++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
            const speed = Math.random() * 7 + 4;
            particlesRef.current.push({
              x: fountainX,
              y: groundY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: colors[Math.floor(Math.random() * colors.length)],
              size: Math.random() * 3 + 2,
              decay: 0.025,
            });
          }
        }, f * 60);
      }
      return;
    }

    rocketsRef.current.push({
      x: startX,
      y: canvas.height,
      targetY: destY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 3 + 9),
      color: colors[Math.floor(Math.random() * colors.length)],
      type,
      exploded: false,
    });
  }, [soundEnabled, colors]);

  // Trigger special preset
  const triggerPreset = (type: 'standard' | 'heart' | 'willow' | 'fountain' | 'ladi') => {
    setActivePreset(type);
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    if (type === 'heart') {
      launchRocket(canvas.width / 2, canvas.height * 0.3, 'heart');
    } else if (type === 'willow') {
      launchRocket(canvas.width * 0.35, canvas.height * 0.25, 'willow');
      setTimeout(() => launchRocket(canvas.width * 0.65, canvas.height * 0.25, 'willow'), 300);
    } else if (type === 'fountain') {
      launchRocket(canvas.width * 0.3, canvas.height, 'fountain');
      launchRocket(canvas.width * 0.7, canvas.height, 'fountain');
    } else if (type === 'ladi') {
      launchRocket(canvas.width / 2, canvas.height * 0.2, 'ladi');
    } else {
      // Grand multi burst
      launchRocket(canvas.width * 0.25, canvas.height * 0.35, 'standard');
      setTimeout(() => launchRocket(canvas.width * 0.5, canvas.height * 0.25, 'standard'), 200);
      setTimeout(() => launchRocket(canvas.width * 0.75, canvas.height * 0.35, 'standard'), 400);
    }

    setTimeout(() => setActivePreset(null), 1000);
  };

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 450;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (time: number) => {
      // Semi-transparent background clear for smooth light trails
      ctx.fillStyle = skyTheme === 'midnight' 
        ? 'rgba(5, 7, 20, 0.22)' 
        : skyTheme === 'deep-purple' 
        ? 'rgba(20, 5, 30, 0.22)' 
        : 'rgba(5, 20, 25, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Auto launch periodically if active
      if (autoShow && time - lastAutoLaunchRef.current > 1800) {
        lastAutoLaunchRef.current = time;
        const randomType = Math.random() > 0.7 ? 'heart' : Math.random() > 0.5 ? 'willow' : 'standard';
        launchRocket(undefined, undefined, randomType as 'standard' | 'heart' | 'willow');
      }

      // Update & Draw Rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.x += r.vx;
        r.y += r.vy;

        // Draw rocket head & spark tail
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Spark trail
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - r.vx * 3, r.y - r.vy * 3);
        ctx.strokeStyle = '#fffb91';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Check if reached apex target
        if (r.y <= r.targetY || r.vy >= 0) {
          createExplosion(r.x, r.y, r.color, r.type);
          rocketsRef.current.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.isSpark ? 0.04 : 0.06; // gravity
        p.vx *= 0.98; // air drag
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [autoShow, createExplosion, launchRocket, skyTheme]);

  // Click / Touch to launch at pointer
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    launchRocket(x, y, 'standard');
  };

  return (
    <div id="firecracker-zone" className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden bg-slate-950 border-8 border-pink-400 shadow-[14px_14px_0px_rgba(244,114,182,0.4)]">
      {/* Top Header Controls Bar */}
      <div className="relative z-10 px-4 py-3 sm:px-6 sm:py-4 bg-slate-900/90 border-b-4 border-pink-400/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-yellow-400 border-2 border-yellow-300 flex items-center justify-center text-slate-950 shadow-md">
            <Flame className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              Bestie Sky Firecracker Show (ફટાકડા ફોડો 🎆)
            </h2>
            <p className="text-xs text-yellow-300 font-bold">
              Tap anywhere on the night sky to shoot custom fireworks!
            </p>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sky Mood Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-full border-2 border-pink-400 text-xs font-bold">
            <button
              onClick={() => setSkyTheme('midnight')}
              className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${skyTheme === 'midnight' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-300 hover:text-white'}`}
            >
              Midnight
            </button>
            <button
              onClick={() => setSkyTheme('deep-purple')}
              className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${skyTheme === 'deep-purple' ? 'bg-purple-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              Galaxy
            </button>
            <button
              onClick={() => setSkyTheme('aurora')}
              className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${skyTheme === 'aurora' ? 'bg-blue-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              Aurora
            </button>
          </div>

          <button
            onClick={() => setAutoShow(!autoShow)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black border-2 transition cursor-pointer ${autoShow ? 'bg-emerald-500 border-emerald-400 text-white shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            {autoShow ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoShow ? 'Auto Fireworks ON' : 'Paused'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full text-xs border-2 transition cursor-pointer ${soundEnabled ? 'bg-pink-500 border-pink-400 text-white shadow-md' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            title={soundEnabled ? 'Sound Enabled' : 'Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Sky Canvas */}
      <div className="relative w-full h-80 sm:h-[420px] cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />

        {/* Ambient Sky Decor overlay */}
        <div className="absolute top-4 left-4 pointer-events-none text-xs text-yellow-300 font-black bg-pink-900/80 px-3 py-1.5 rounded-full border-2 border-yellow-300 flex items-center gap-2 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
          <span>Interactive Sky • Tap to Ignite</span>
        </div>

        {/* City Skyline Silhouette at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-10 pointer-events-none bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-end justify-between px-6 opacity-80">
          <div className="w-12 h-6 bg-slate-900 rounded-t border-t border-slate-800" />
          <div className="w-16 h-8 bg-slate-900 rounded-t border-t border-slate-800" />
          <div className="w-20 h-5 bg-slate-900 rounded-t border-t border-slate-800" />
          <div className="w-14 h-9 bg-slate-900 rounded-t border-t border-slate-800" />
        </div>
      </div>

      {/* Launch Control Panel with 5 Traditional & Grand Firecracker Types (Vibrant Pop Colors) */}
      <div className="p-4 sm:p-5 bg-slate-900 border-t-4 border-pink-400/40 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => triggerPreset('standard')}
          className="p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-red-400 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-yellow-300" />
            <span>Sky Rocket</span>
          </div>
          <span className="text-[11px] text-yellow-200 font-bold">આકાશી રોકેટ 🚀</span>
        </button>

        <button
          onClick={() => triggerPreset('heart')}
          className="p-3 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-pink-300 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-white fill-white" />
            <span>Bestie Heart</span>
          </div>
          <span className="text-[11px] text-pink-100 font-bold">દિલ રોકેટ 💖</span>
        </button>

        <button
          onClick={() => triggerPreset('fountain')}
          className="p-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-yellow-500 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Anar Fountain</span>
          </div>
          <span className="text-[11px] text-amber-950 font-bold">ફુવારો / કોઠી 🎇</span>
        </button>

        <button
          onClick={() => triggerPreset('ladi')}
          className="p-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-orange-300 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>1000 Ladi Burst</span>
          </div>
          <span className="text-[11px] text-yellow-100 font-bold">લડી ફટાકડા 🧨</span>
        </button>

        <button
          onClick={() => triggerPreset('willow')}
          className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-purple-400 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Mega Finale</span>
          </div>
          <span className="text-[11px] text-purple-200 font-bold">મહા ધમાકા 🌌</span>
        </button>
      </div>
    </div>
  );
};
