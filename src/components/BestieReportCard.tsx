import React from 'react';
import { motion } from 'motion/react';
import { Award, Crown, CheckCircle2, HeartHandshake, Zap, Cookie, ShieldCheck, Printer, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { fireGrandConfetti } from '../utils/confetti';

interface BestieReportCardProps {
  bestieName: string;
  senderName: string;
  age: number;
  superlatives: {
    title: string;
    score: string;
    verdict: string;
    icon: string;
  }[];
}

export const BestieReportCard: React.FC<BestieReportCardProps> = ({
  bestieName,
  senderName,
  age,
  superlatives,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-pink-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Cookie':
        return <Cookie className="w-5 h-5 text-orange-500" />;
      default:
        return <Award className="w-5 h-5 text-purple-500" />;
    }
  };

  const handlePrint = () => {
    sound.playCelebrationFanfare();
    fireGrandConfetti();
    window.print();
  };

  return (
    <div id="report-card-zone" className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 bg-white border-8 border-yellow-400 shadow-[14px_14px_0px_rgba(253,224,71,0.5)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-amber-900 text-xs font-black border-2 border-yellow-300 mb-2">
            <Award className="w-4 h-4 text-pink-500" />
            Official Friendship Certification
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-pink-600 leading-tight">
            World’s #1 Bestie Diploma & Report Card 📜
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1">
            Certified by the International Friendship Council of Awesomeness
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-black border-2 border-pink-400 flex items-center gap-2 cursor-pointer transition active:scale-95 shadow-md self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Certificate</span>
        </button>
      </div>

      {/* Diploma Certificate Paper Frame */}
      <div className="relative max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl bg-yellow-50 text-slate-900 border-8 border-yellow-400 shadow-[10px_10px_0px_rgba(251,191,36,0.5)]">
        {/* Certificate Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <Crown className="w-96 h-96 text-amber-950" />
        </div>

        {/* Certificate Header */}
        <div className="text-center border-b-2 border-yellow-300 pb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-300 border-3 border-yellow-500 shadow-md mb-2">
            <Crown className="w-8 h-8 text-amber-950" />
          </div>
          <h3 className="text-2xl sm:text-4xl font-black font-display tracking-wider uppercase text-pink-600">
            Certificate of Supreme Bestie Excellence
          </h3>
          <p className="text-xs text-slate-700 font-serif italic mt-1 font-bold">
            This prestigious honor is unconditionally awarded on this special birthday to:
          </p>

          <div className="mt-4 inline-block px-8 py-2 border-b-4 border-pink-500">
            <span className="text-4xl sm:text-6xl font-black font-display text-pink-600">
              {bestieName}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-800 mt-2">
            For outstanding performance, unmatched laughter, and being the world’s most precious companion for {age} years!
          </p>
        </div>

        {/* Superlatives Grade Table */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
          {superlatives.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border-2 border-yellow-300 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-100">
                  {getIcon(item.icon)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-pink-600 font-bold">
                    Verdict: {item.verdict}
                  </span>
                </div>
              </div>

              <span className="font-mono text-sm font-black text-pink-600 bg-pink-100 px-2.5 py-1 rounded-full border border-pink-300">
                {item.score}
              </span>
            </div>
          ))}
        </div>

        {/* Certificate Signatures & Official Gold Stamp */}
        <div className="pt-6 border-t-2 border-yellow-300 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left">
            <span className="font-handwriting text-2xl sm:text-3xl font-bold text-slate-900 block">
              {senderName}
            </span>
            <div className="w-36 h-0.5 bg-slate-700 mx-auto sm:mx-0 my-1" />
            <span className="text-[10px] uppercase font-black text-slate-700 tracking-wider">
              Forever Bestie Signature
            </span>
          </div>

          {/* Official Golden Stamp */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-24 h-24 rounded-full bg-yellow-300 border-4 border-dashed border-yellow-600 shadow-xl flex flex-col items-center justify-center p-2 text-center transform -rotate-6"
          >
            <ShieldCheck className="w-6 h-6 text-amber-950 mb-0.5" />
            <span className="text-[8px] font-black text-amber-950 uppercase leading-none tracking-tighter">
              100% GENUINE
            </span>
            <span className="text-[7px] font-bold text-amber-900 uppercase leading-none">
              BEST FRIEND SEAL
            </span>
          </motion.div>

          <div className="text-center sm:text-right">
            <span className="font-mono text-sm font-black text-slate-900 block">
              Lifetime Validity
            </span>
            <div className="w-36 h-0.5 bg-slate-700 mx-auto sm:mx-0 my-1" />
            <span className="text-[10px] uppercase font-black text-slate-700 tracking-wider">
              Expiry Date: Never (ક્યારેય નહિ)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
