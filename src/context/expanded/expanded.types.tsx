export interface ExpandedContextType {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
}

export interface ExpandedProviderProps {
    children: JSX.Element[] | JSX.Element;
}
