import { useState, useCallback } from 'react';

interface UseGameAccordionReturn {
  activeId: string | null;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: () => void;
  getFlexGrow: (id: string) => number;
}

export function useGameAccordion(): UseGameAccordionReturn {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleMouseEnter = useCallback((id: string) => setActiveId(id), []);
  const handleMouseLeave = useCallback(() => setActiveId(null), []);

  // 2.55 / (2.55 + 1 + 1) ≈ 56%  |  1 / 4.55 ≈ 22%  |  1/3 = 33% (rest)
  const getFlexGrow = useCallback((id: string): number => {
    if (!activeId) return 1;
    return activeId === id ? 2.55 : 1;
  }, [activeId]);

  return { activeId, handleMouseEnter, handleMouseLeave, getFlexGrow };
}
