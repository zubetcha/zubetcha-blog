import { useContext, createContext } from 'react';

const SelectContext = createContext({ setSelected: (selected: string) => {} });
export const useSelectContext = () => {
	const context = useContext(SelectContext);

	if (!context) {
		throw new Error('useSelectContext must be used in');
	}

	return context;
};

interface Props {
	children: React.ReactNode;
	setSelected: (selected: string) => void;
}

export const SelectProvider = ({ children, setSelected }: Props) => {
	return (
		<SelectContext.Provider value={{ setSelected }}>
			{children}
		</SelectContext.Provider>
	);
};
