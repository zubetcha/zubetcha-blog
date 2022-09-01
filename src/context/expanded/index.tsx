import { createContext, useContext, useState } from 'react';
import { ExpandedContextType, ExpandedProviderProps } from './expanded.types';

const ExpandedDefaultValue: ExpandedContextType = {
    expanded: true,
    setExpanded: async (Expanded: boolean) => null,
};

export const ExpandedContext =
    createContext<ExpandedContextType>(ExpandedDefaultValue);

export const useExpanded = () => useContext(ExpandedContext);

export const ExpandedProvider = ({ children }: ExpandedProviderProps) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <ExpandedContext.Provider value={{ expanded, setExpanded }}>
            {children}
        </ExpandedContext.Provider>
    );
};
