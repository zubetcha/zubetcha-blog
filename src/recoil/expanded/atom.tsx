import { atom } from 'recoil';

export const expandedState = atom({
	key: 'expanded',
	default: true,
});
