import React, { useState } from 'react';

import { GameLandingLayout } from '../../components/layout/GameLandingLayout';
import { GameSoloTab } from '../../components/game/GameSoloTab';
import { GameTeamsTab } from '../../components/game/GameTeamsTab';
import { GameStatsTab } from '../../components/game/GameStatsTab';
import { GAMES_DATA } from '../../data/games.data';
import type { GameTab } from '../../types/gameTab.types';
import type { GameType } from '../../types/team.types';

interface GameLandingPageProps {
  gameId: GameType;
}

/** Landing d'un jeu avec onglets Solo / Équipes / Stats (Valorant, TFT). */
export function GameLandingPage({ gameId }: GameLandingPageProps): React.JSX.Element {
  const game = GAMES_DATA.find((g) => g.id === gameId)!;
  const [activeTab, setActiveTab] = useState<GameTab>('solo');

  return (
    <GameLandingLayout game={game} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'solo' && <GameSoloTab game={game} />}
      {activeTab === 'teams' && <GameTeamsTab game={game} />}
      {activeTab === 'stats' && <GameStatsTab game={game} />}
    </GameLandingLayout>
  );
}
