import { useState } from 'react';

interface UseGameAccordionReturn {
  activeId: string | null;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: () => void;
  getCardWidth: (id: string) => string;
}

export function useGameAccordion(): UseGameAccordionReturn {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => setActiveId(id);
  const handleMouseLeave = () => setActiveId(null);

  const getCardWidth = (id: string): string => {
    if (activeId === null) return '33.333%';
    return activeId === id ? '56%' : '22%';
  };

  return { activeId, handleMouseEnter, handleMouseLeave, getCardWidth };
}
