import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ParsedRiotId, PlayerSearchState } from '../types/player.types';

type GameRoute = 'lol' | 'valorant' | 'tft';

interface UsePlayerSearchReturn {
  state: PlayerSearchState;
  handleInputChange: (value: string) => void;
  handleSearch: () => void;
}

function parseRiotId(input: string): ParsedRiotId | null {
  const trimmed = input.trim();
  const hashIndex = trimmed.lastIndexOf('#');

  if (hashIndex <= 0 || hashIndex === trimmed.length - 1) return null;

  const gameName = trimmed.slice(0, hashIndex).trim();
  const tagLine = trimmed.slice(hashIndex + 1).trim();

  if (!gameName || !tagLine || tagLine.length > 5) return null;

  return { gameName, tagLine };
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
