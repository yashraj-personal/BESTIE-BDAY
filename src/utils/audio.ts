/**
 * Web Audio API based Sound Synthesizer for Birthday Celebrations
 * Provides zero-dependency sound effects:
 * - Happy Birthday Melodic Synth
 * - Firecracker Explosions & Sparkle Crackles
 * - Balloon Pops
 * - Candle Whoosh & Blow
 * - Cheers & Fanfares
 * - Slice cutting swooshes
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentMelodyTimer: number | null = null;
  private isMelodyPlaying: boolean = false;

  private initCtx() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      this.ctx = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopHappyBirthday();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // --- Sound: Firecracker Boom & Rocket Whistle ---
  public playFireworkBoom(intensity: 'small' | 'medium' | 'mega' = 'medium') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Low boom oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      const baseFreq = intensity === 'mega' ? 120 : intensity === 'medium' ? 150 : 180;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + (intensity === 'mega' ? 0.8 : 0.5));

      const volume = intensity === 'mega' ? 0.9 : intensity === 'medium' ? 0.6 : 0.4;
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (intensity === 'mega' ? 0.9 : 0.6));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);

      // Noise crackle burst
      this.playCrackle(now + 0.05, intensity === 'mega' ? 12 : 6);
    } catch {
      // Audio error safe fallback
    }
  }

  public playRocketLaunch() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.6);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch {}
  }

  private playCrackle(startTime: number, count: number = 8) {
    if (!this.ctx) return;
    for (let i = 0; i < count; i++) {
      const delay = startTime + (Math.random() * 0.4);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 1200, delay);

      gain.gain.setValueAtTime(0.15, delay);
      gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(delay);
      osc.stop(delay + 0.05);
    }
  }

  // --- Sound: Balloon Pop ---
  public playBalloonPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // --- Sound: Sparkle / Magic Chimes ---
  public playChime(pitchModifier: number = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5].map(n => n * pitchModifier);

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } catch {}
  }

  // --- Sound: Blow Candle Whoosh ---
  public playCandleBlow() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Filtered noise swoosh
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.45);
    } catch {}
  }

  // --- Sound: Fanfare / Celebration Cheer ---
  public playCelebrationFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // High triumphant brass fanfare: C5, E5, G5, C6
      const fanfareNotes = [
        { f: 523.25, d: 0.15, time: 0 },
        { f: 523.25, d: 0.15, time: 0.15 },
        { f: 523.25, d: 0.15, time: 0.3 },
        { f: 659.25, d: 0.4, time: 0.45 },
        { f: 523.25, d: 0.15, time: 0.9 },
        { f: 659.25, d: 0.15, time: 1.05 },
        { f: 783.99, d: 0.15, time: 1.2 },
        { f: 1046.5, d: 0.8, time: 1.35 },
      ];

      fanfareNotes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.time);

        gain.gain.setValueAtTime(0.35, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.d + 0.05);
      });
    } catch {}
  }

  // --- Sound: Happy Birthday Melody Synth (Music Box / Marimba Style) ---
  public playHappyBirthday(onNote?: (noteName: string) => void) {
    if (this.isMuted) return;
    this.stopHappyBirthday();
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.isMelodyPlaying = true;
      const now = this.ctx.currentTime + 0.1;

      // Note definitions (Happy Birthday in F Major / C Major)
      // C4, C4, D4, C4, F4, E4 ...
      const C4 = 261.63;
      const D4 = 293.66;
      const E4 = 329.63;
      const F4 = 349.23;
      const G4 = 392.00;
      const A4 = 440.00;
      const Bb4 = 466.16;
      const C5 = 523.25;

      const song: { f: number; dur: number; rest: number; name: string }[] = [
        // Happy Birthday to you
        { f: C4, dur: 0.35, rest: 0.1, name: 'Hap-' },
        { f: C4, dur: 0.25, rest: 0.1, name: 'py' },
        { f: D4, dur: 0.55, rest: 0.1, name: 'Birth-' },
        { f: C4, dur: 0.55, rest: 0.1, name: 'day' },
        { f: F4, dur: 0.55, rest: 0.1, name: 'to' },
        { f: E4, dur: 0.9, rest: 0.25, name: 'you!' },

        // Happy Birthday to you
        { f: C4, dur: 0.35, rest: 0.1, name: 'Hap-' },
        { f: C4, dur: 0.25, rest: 0.1, name: 'py' },
        { f: D4, dur: 0.55, rest: 0.1, name: 'Birth-' },
        { f: C4, dur: 0.55, rest: 0.1, name: 'day' },
        { f: G4, dur: 0.55, rest: 0.1, name: 'to' },
        { f: F4, dur: 0.9, rest: 0.25, name: 'you!' },

        // Happy Birthday dear Bestie
        { f: C4, dur: 0.35, rest: 0.1, name: 'Hap-' },
        { f: C4, dur: 0.25, rest: 0.1, name: 'py' },
        { f: C5, dur: 0.6, rest: 0.1, name: 'Birth-' },
        { f: A4, dur: 0.6, rest: 0.1, name: 'day' },
        { f: F4, dur: 0.5, rest: 0.1, name: 'dear' },
        { f: E4, dur: 0.5, rest: 0.1, name: 'Bes-' },
        { f: D4, dur: 0.8, rest: 0.2, name: 'tie!' },

        // Happy Birthday to you
        { f: Bb4, dur: 0.4, rest: 0.1, name: 'Hap-' },
        { f: Bb4, dur: 0.3, rest: 0.1, name: 'py' },
        { f: A4, dur: 0.6, rest: 0.1, name: 'Birth-' },
        { f: F4, dur: 0.6, rest: 0.1, name: 'day' },
        { f: G4, dur: 0.6, rest: 0.1, name: 'to' },
        { f: F4, dur: 1.2, rest: 0.4, name: 'YOU! ✨🎂' },
      ];

      let runningTime = now;

      song.forEach((item) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscHarmonic = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Music Box Bell timbre (Sine + slight harmonic chime)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.f, runningTime);

        oscHarmonic.type = 'triangle';
        oscHarmonic.frequency.setValueAtTime(item.f * 2, runningTime);

        gain.gain.setValueAtTime(0.28, runningTime);
        gain.gain.exponentialRampToValueAtTime(0.001, runningTime + item.dur);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(runningTime);
        oscHarmonic.start(runningTime);
        osc.stop(runningTime + item.dur + 0.1);
        oscHarmonic.stop(runningTime + item.dur + 0.1);

        if (onNote) {
          const delayMs = (runningTime - now) * 1000;
          setTimeout(() => {
            if (this.isMelodyPlaying) {
              onNote(item.name);
            }
          }, delayMs);
        }

        runningTime += item.dur + item.rest;
      });

      // Loop after finishing song
      const totalDurationMs = (runningTime - now) * 1000 + 1000;
      this.currentMelodyTimer = window.setTimeout(() => {
        if (this.isMelodyPlaying) {
          this.playHappyBirthday(onNote);
        }
      }, totalDurationMs);

    } catch {
      this.isMelodyPlaying = false;
    }
  }

  public stopHappyBirthday() {
    this.isMelodyPlaying = false;
    if (this.currentMelodyTimer) {
      clearTimeout(this.currentMelodyTimer);
      this.currentMelodyTimer = null;
    }
  }

  public isPlaying(): boolean {
    return this.isMelodyPlaying;
  }
}

export const sound = new SoundSynthesizer();
