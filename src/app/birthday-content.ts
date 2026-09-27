export type ColorKey = 'sylus' | 'blue' | 'indigo' | 'purple' | 'winePurple' | 'orange';
export type GameKind = 'quiz' | 'typing' | 'bounce' | 'aim' | 'mole';

export interface TriviaQuestion {
  prompt: string;
  answers: string[];
  correct: number;
  note: string;
  leftImage?: string;
  rightImage?: string;
}

export interface PathMedia {
  /** This art's unique gacha video, played for every pull. */
  pullVideo: string;
  /** This art's unique loss video, played after a miss. */
  loseVideo: string;
  gachaAudio: string;
  winAudio: string;
  loseAudio: string;
  gameAudio: string;
  /** Used by the whack-a-mole game. */
  moleImage: string;
}

export interface ArtReward {
  image: string;
  artistQuote: string;
  artistCredit: string;
}

export interface ColorPath {
  name: string;
  theme: string;
  adjective: string;
  color: string;
  secondaryColor: string;
  swatchText: string;
  /** Indigo has two art rewards; the other paths each have one. */
  arts: ArtReward[];
  game: GameKind;
  questions: TriviaQuestion[];
  typingSentence?: string;
  rewardTitle: string;
  rewardNote: string;
  art: string;
  media: PathMedia;
}

const NO_MEDIA: PathMedia = {
  pullVideo: '', loseVideo: '', gachaAudio: '', winAudio: '', loseAudio: '', gameAudio: '', moleImage: 'images/Arts/Quaso.png',
};

/**
 * Six character art paths. Add art files under public/images/Arts and fill in
 * art image, artist quote, and artist credit for each reward. Put game/gacha media
 * under public/media/gacha. Each path has its own pullVideo and loseVideo fields.
 * Quiz questions are editable in the two quiz entries; `correct` uses answer numbers 1–3.
 */
export const BIRTHDAY_PATHS: Record<ColorKey, ColorPath> = {
  sylus: {
    name: 'Sylus', theme: 'Wine red & black', adjective: 'bold & mysterious', color: '#550816', secondaryColor: '#0B0A0A', swatchText: '#F8E9DA',
    arts: [{ image: 'images/Arts/Aella.png', artistQuote: 'Tsuquaso #1 Fan', artistCredit: 'Esmenace' }], game: 'quiz',
    rewardTitle: 'Art #1', rewardNote: 'The art is yours. Happy birthday, Xenia.', art: '❄', media: { ...NO_MEDIA, pullVideo: '/media/gacha/LADSPull.mp4', loseVideo: '/media/gacha/LADSLost.mp4' },
    questions: [
      { prompt: 'Who is the Astral Enforcer whose dream is to capture Sylus after his escape from space-time prison', answers: ['Bernard', 'Myer', 'Xenia - because she wants sylus'], correct: 1, note: 'Idk what it means , Ask Pilot', },
      { prompt: 'What are Sylus 3 sizes', answers: ['bust-119, waist-82, hip-105', 'bust-110, waist-75, hip-90', 'bust-109, waist-72, hip-95 '], correct: 3, note: 'If you dont know this , Sylus aint your husband!' },
      { prompt: 'What does sylus do in his free time?', answers: ['Playing space combat with luke and Kieran', 'Stalk Xenia from afar', 'Shooting Practice'], correct: 1, note: 'He also bullies me in discord in his free time!' },
    ],
  },
  blue: {
    name: 'White & blue', theme: 'White & blue', adjective: 'soft & dreamy', color: '#BFD8EE', secondaryColor: '#F8F8F4', swatchText: '#0B0A0A',
    arts: [{ image: 'images/Arts/Holy.jpg', artistQuote: 'OLLY OLLY OLLY', artistCredit: 'Holy Banchuchen' }], game: 'quiz',
    rewardTitle: 'Art #2', rewardNote: 'A cool little treasure, just for you.', art: '❄', media: { ...NO_MEDIA, pullVideo: '/media/gacha/ZZZPull.mp4', loseVideo: '/media/gacha/ZZZLost.mp4' },
    questions: [
      { prompt: 'How tall is Tsuki?', answers: ['6 apples tall', '5 apples tall', '7 apples tall'], correct: 3, note: 'Tookie pookie wookie!' },
      { prompt: 'Which of you mods is a brat?', answers: ['Chu', 'Fanum', 'Quaso'], correct: 3, note: 'Our beloved Brat!' },
      { prompt: 'Who Fanum fav Gacha wife!', answers: ['Changli', 'Raiden Shogun', 'Yi Xuan'], correct: 3, note: 'If you dont know this I resign!' },
    ],
  },
  indigo: {
    name: 'Indigo & white', theme: 'Indigo & white', adjective: 'dreamy & curious', color: '#514A91', secondaryColor: '#F8F8F4', swatchText: '#F8E9DA',
    arts: [{ image: 'images/Arts/Ohmu1.png', artistQuote: 'Love from your Mommy riceu', artistCredit: 'OhmuRice' }, { image: 'images/Arts/Ohmu2.png', artistQuote: '2 quotes for no reason', artistCredit: 'OhmuRice' }], game: 'mole', questions: [],
    rewardTitle: 'Lets GAMBA', rewardNote: 'Mommy Rice arts', art: '✧', media: { ...NO_MEDIA, pullVideo: '/media/gacha/HSRPull.mp4', loseVideo: '/media/gacha/HSRLost.mp4' },
  },
  purple: {
    name: 'Purple & black', theme: 'Purple & black', adjective: 'playful & electric', color: '#722E83', secondaryColor: '#0B0A0A', swatchText: '#F8E9DA',
    arts: [{ image: 'images/Arts/Chu.png', artistQuote: 'Guys, I brought another Xavier and cloud merch', artistCredit: 'Chu Minamoto' }], game: 'bounce', questions: [],
    rewardTitle: 'This is probably BEST one yet!', rewardNote: 'From our beloved CHU BEST-NAMOTO', art: '✦', media: { ...NO_MEDIA, pullVideo: '/media/gacha/WuwaPull.mp4', loseVideo: '/media/gacha/WuwaLost.mp4' },
  },
  winePurple: {
    name: 'Wine red & purple', theme: 'Wine red & purple', adjective: 'quick & dramatic', color: '#702047', secondaryColor: '#550816', swatchText: '#F8E9DA',
    arts: [{ image: 'images/Arts/Reokie.png', artistQuote: 'Reokie Pookie Wookie', artistCredit: '두부' }], game: 'typing', typingSentence: 'Xenia is chaos and gold!', questions: [],
    rewardTitle: 'This is my fav from a cute person', rewardNote: 'Our REOKIE POOKIE WOOKIE', art: '❣', media: { ...NO_MEDIA, pullVideo: '/media/gacha/WuwaPull.mp4', loseVideo: '/media/gacha/WuwaLost2.mp4' },
  },
  orange: {
    name: 'Orange & white', theme: 'Orange & white', adjective: 'bright & lively', color: '#E88936', secondaryColor: '#F8F8F4', swatchText: '#0B0A0A',
    arts: [{ image: 'images/Arts/Bahu.gif', artistQuote: 'Its Better to Poop in the Sink than sink in the poop', artistCredit: 'Buttjuice' }], game: 'aim', questions: [],
    rewardTitle: 'Guess who is Orange and white!', rewardNote: 'Thats right its BAHU MAAH BUDDY!', art: '☼', media: { ...NO_MEDIA, pullVideo: '/media/gacha/GenshinPull.mp4', loseVideo: '/media/gacha/GenshinLost.mp4' },
  },
};
