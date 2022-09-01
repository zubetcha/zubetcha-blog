export interface ThemeContextType {
    theme: ThemeUnionType;
    setTheme: (theme: ThemeUnionType) => void;
}

export type ThemeUnionType = 'dark' | 'light';

export interface ThemeProviderProps {
    children: JSX.Element[] | JSX.Element;
}
