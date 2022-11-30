import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { expandedState } from './atom';

export const useExpanded = () => useRecoilState(expandedState);
export const useSetExpanded = () => useSetRecoilState(expandedState);
export const useExpandedValue = () => useRecoilValue(expandedState);
