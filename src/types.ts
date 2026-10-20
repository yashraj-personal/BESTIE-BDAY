export interface BestiePhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotation: number;
  sticker?: string;
  backNote?: string;
}

export interface CouponItem {
  id: string;
  title: string;
  description: string;
  code: string;
  iconName: string;
  color: string;
  isUnlocked: boolean;
}

export interface WishItem {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  starColor: string;
  emoji: string;
}

export interface BestieConfig {
  bestieName: string;
  nickname: string;
  senderName: string;
  age: number;
  birthDate?: string;
  genderOrVibe: 'queen' | 'king' | 'rockstar' | 'partner-in-crime';
  customTitle: string;
  heartfeltLetter: string;
  favoriteSongTitle?: string;
  themeColor: 'pink-gold' | 'neon-party' | 'royal-purple' | 'midnight-galaxy' | 'golden-glam';
  photos: BestiePhoto[];
  coupons: CouponItem[];
  superlatives: {
    title: string;
    score: string;
    verdict: string;
    icon: string;
  }[];
}
