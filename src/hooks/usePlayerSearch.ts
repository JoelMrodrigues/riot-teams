import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { parseRiotId } from '../utils/riotId';
import type { PlayerSearchState } from '../types/player.types';

type GameRoute = 'lol' | 'valorant' | 'tft';

interface UsePlayerSearchReturn {
  state: PlayerSearchState;
  handleInputChange: (value: string) => void;
  handleSearch: () => void;
}

export function usePlayerSearch(gameRoute: GameRoute): UsePlayerSearchReturn {
  const navigate = useNavigate();
  const [state, setState] = useState<PlayerSearchState>({ input: '', error: null });

  const handleInputChange = (value: string) => {
    setState({ input: value, error: null });
  };

  const handleSearch = () => {
    const parsed = parseRiotId(state.input);
    if (!parsed) {
      setState((prev) => ({
        ...prev,
        error: 'Format invalide — utilisez : NomJoueur#TAG (ex: Faker#KR1)',
      }));
      return;
    }
    navigate(
      `/${gameRoute}/player/${encodeURIComponent(parsed.gameName)}/${encodeURIComponent(parsed.tagLine)}`,
    );
  };

  return { state, handleInputChange, handleSearch };
}
