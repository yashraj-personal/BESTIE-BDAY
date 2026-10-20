import { BestieConfig } from '../types';

export const initialBestieConfig: BestieConfig = {
  bestieName: 'Pari',
  nickname: 'Chirkut / Drama Queen 👑',
  senderName: 'Your Forever Bestie',
  age: 21,
  birthDate: 'Today is Your Day!',
  genderOrVibe: 'queen',
  customTitle: 'The Craziest, Funniest & Most Precious Human Ever',
  heartfeltLetter: `To my dearest bestie,

Happy Birthday! 🎂✨
Life with you is literally a 24/7 comedy show and an endless safe space. From our spontaneous plans, random laughing fits at 2 AM, eating street food until our stomachs hurt, to standing by each other through every high and low — you truly make this world 1000x brighter!

Thank you for being my constant cheerleader, secret keeper, personal therapist, and the person who always gets my weirdest jokes. 

May this year bring you boundless happiness, endless success, all the delicious food, dreams fulfilled, and unlimited memories with me! You deserve nothing but the absolute best in the universe!

Happy Birthday, Partner in Crime! Love you forever & always! ❤️🎉`,
  favoriteSongTitle: 'Happy Birthday Melody & Bestie Beats',
  themeColor: 'pink-gold',
  photos: [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      caption: 'The Birthday Queen herself! Slaying as always ✨',
      date: 'Forever Iconic',
      rotation: -3,
      sticker: '👑',
      backNote: 'Always lighting up every single room you walk into!'
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      caption: 'That smile that cures all bad days! 😄',
      date: 'Pure Joy',
      rotation: 2.5,
      sticker: '💖',
      backNote: 'Never stop smiling because your happiness is contagious.'
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
      caption: 'Partner in Crime since Day 1 🍕🥤',
      date: 'Unbreakable Bond',
      rotation: -1.5,
      sticker: '🥳',
      backNote: 'No matter what happens, I always got your back!'
    },
    {
      id: 'photo-4',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
      caption: 'Main Character Energy only! 🌟',
      date: 'Vibes Only',
      rotation: 3,
      sticker: '✨',
      backNote: 'The world is yours, go conquer every dream!'
    }
  ],
  coupons: [
    {
      id: 'c1',
      title: 'Free Midnight Ice Cream Run 🍦',
      description: 'Redeemable anytime past 11 PM. Any flavor, double scoops, on my bill!',
      code: 'BESTIE-ICECREAM-24',
      iconName: 'IceCream',
      color: 'bg-rose-500',
      isUnlocked: false
    },
    {
      id: 'c2',
      title: '3 AM Drama & Rant Session 🗣️',
      description: '100% attentive listening with zero unsolicited advice and full support!',
      code: 'BESTIE-VENT-UNLIMITED',
      iconName: 'MessageCircleHeart',
      color: 'bg-purple-500',
      isUnlocked: false
    },
    {
      id: 'c3',
      title: 'Free Street Food Treat (Chai + Momos + Pani Puri) 🥟',
      description: 'Full food fiesta without looking at prices. You eat, I pay!',
      code: 'BESTIE-FOOD-FIESTA',
      iconName: 'Utensils',
      color: 'bg-amber-500',
      isUnlocked: false
    },
    {
      id: 'c4',
      title: 'Get Out of Trouble / Alibi Card 🤫',
      description: 'Will vouch for you no questions asked, anytime, anywhere.',
      code: 'BESTIE-ALIBI-SAFE',
      iconName: 'ShieldCheck',
      color: 'bg-emerald-500',
      isUnlocked: false
    },
    {
      id: 'c5',
      title: 'Movie / Shopping Date Day 🎬🛍️',
      description: 'You pick the movie, popcorn tub, and outfits — whole day dedicated to you!',
      code: 'BESTIE-VIP-DAY',
      iconName: 'Film',
      color: 'bg-indigo-500',
      isUnlocked: false
    },
    {
      id: 'c6',
      title: 'Unlimited Hugs & Affirmations Card 🫂',
      description: 'For when things get overwhelming. Always reminder: You are loved!',
      code: 'BESTIE-WARM-HUG',
      iconName: 'Heart',
      color: 'bg-pink-600',
      isUnlocked: false
    }
  ],
  superlatives: [
    {
      title: '3 AM Crisis Manager',
      score: '100 / 100',
      verdict: 'Gold Standard Therapist',
      icon: 'HeartHandshake'
    },
    {
      title: 'Drama & Gossip Speed',
      score: '5G Speed ⚡',
      verdict: 'Breaking News Anchor',
      icon: 'Zap'
    },
    {
      title: 'Snack Stealing Capability',
      score: '999%',
      verdict: 'Ninja Master Thief',
      icon: 'Cookie'
    },
    {
      title: 'Loyalty & Heart Size',
      score: 'Infinity ∞',
      verdict: 'Pure Soul / Diamond Tier',
      icon: 'Award'
    }
  ]
};
