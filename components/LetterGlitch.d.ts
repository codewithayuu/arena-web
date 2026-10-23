import React from 'react';

export interface LetterGlitchProps extends React.HTMLAttributes<HTMLDivElement> {
  glitchColors?: string[];
  baseColor?: string;
  characters?: string;
  fontFamily?: string;
  fontSize?: number;
  spacing?: number;
  density?: number;
  baseOpacity?: number;
  glitchAmount?: number;
  speed?: number;
  smooth?: boolean;
  interactive?: boolean;
  cursorRadius?: number;
  clickEffect?: 'none' | 'tear' | 'burst' | string;
  flow?: number;
  edgeFade?: number;
  centerFade?: number;
  intro?: boolean;
  lightMode?: boolean;
  backgroundColor?: string;
  dpr?: number;
  className?: string;
  style?: React.CSSProperties;
}

export declare const LetterGlitch: React.FC<LetterGlitchProps>;
export default LetterGlitch;
