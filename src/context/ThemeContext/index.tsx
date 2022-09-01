import { createContext, useContext, useState } from 'react';
import {
	ThemeContextType,
	ThemeUnionType,
	ThemeProviderProps,
} from './ThemeContext.types';

const themeDefaultValue: ThemeContextType = {
	theme: 'dark',
	setTheme: async (theme: ThemeUnionType) => null,
};

export const ThemeContext = createContext<ThemeContextType>(themeDefaultValue);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setTheme] = useState('dark');

	return (
		<ThemeContext.Provider value={{ theme, setTheme } as ThemeContextType}>
			{children}
		</ThemeContext.Provider>
	);
};
