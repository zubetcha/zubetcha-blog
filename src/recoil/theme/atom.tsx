import { atom } from 'recoil';

export type Theme = 'light' | 'dark' | null;

export const themeState = atom<Theme>({
	key: 'theme',
	default: null,
});
