import { createContext, useContext, useState } from 'react';

const HoverContext = createContext();

export function HoverProvider({ children }) {
    const [hoveredTitle, setHoveredTitle] = useState('');

    return (
        <HoverContext.Provider value={{ hoveredTitle, setHoveredTitle }}>
            {children}
        </HoverContext.Provider>
    );
}

export function useHover() {
    const context = useContext(HoverContext);
    if (!context) {
        throw new Error('useHover must be used within a HoverProvider');
    }
    return context;
}
