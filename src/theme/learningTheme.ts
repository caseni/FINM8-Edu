export interface LearningTheme {
  colors: {
    background: string;
    surface: string;
    surfaceMuted: string;
    primary: string;
    primaryText: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    risk: string;
  };
  radius: {
    small: number;
    medium: number;
    large: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

/** Adapter default; the flagship can replace every token during Phase 6. */
export const defaultLearningTheme: LearningTheme = {
  colors: {
    background: '#07111F',
    surface: '#102033',
    surfaceMuted: '#162A40',
    primary: '#2DD4BF',
    primaryText: '#042F2E',
    text: '#F8FAFC',
    textMuted: '#9FB0C3',
    border: '#294057',
    success: '#34D399',
    warning: '#FBBF24',
    risk: '#FB7185',
  },
  radius: { small: 8, medium: 14, large: 22 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
};

