export type LyricLine = {
  timestamp: number;
  content: string;
};

export type Lyric = {
  id: string;
  ar: string;
  al: string;
  ti: string;
  length: string;
  lyrics: LyricLine[];
};
