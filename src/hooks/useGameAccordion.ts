import { useState, useCallback } from 'react';

interface UseGameAccordionReturn {
  activeId: string | null;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: () => void;
  getCardWidth: (id: string) => string;
}

export function useGameAccordion(): UseGameAccordionReturn {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleMouseEnter = useCallback((id: string) => setActiveId(id), []);
  const handleMouseLeave = useCallback(() => setActiveId(null), []);

  const getCardWidth = useCallback((id: string): string => {
    if (!activeId) return '33.333%';
    return activeId === id ? '56%' : '22%';
  }, [activeId]);

  return { activeId, handleMouseEnter, handleMouseLeave, getCardWidth };
}
