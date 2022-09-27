import { createContext, useContext } from 'react';
import { SelectContextType } from './types';

const selectDefaultValue: SelectContextType = {
	open: false,
	toggle: () => null,
	selected: null,
	setSelected: () => null,
};

export const SelectContext =
	createContext<SelectContextType>(selectDefaultValue);

export const useSelect = () => useContext(SelectContext);
export * from './types';
