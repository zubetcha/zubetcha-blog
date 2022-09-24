export interface SelectContextType {
	open: boolean;
	toggle: (open: boolean) => void;
	selected: string | null;
	setSelected: (selected: string) => void;
}
