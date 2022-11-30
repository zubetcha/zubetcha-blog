import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { themeState } from './atom';

export const useTheme = () => useRecoilState(themeState);
export const useSetTheme = () => useSetRecoilState(themeState);
export const useThemeValue = () => useRecoilValue(themeState);
