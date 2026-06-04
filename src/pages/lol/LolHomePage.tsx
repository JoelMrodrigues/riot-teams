import React, { useState } from 'react';

import { GameLandingLayout } from '../../components/layout/GameLandingLayout';
import { GameSoloTab } from '../../components/game/GameSoloTab';
import { GameTeamsTab } from '../../components/game/GameTeamsTab';
import { GameStatsTab } from '../../components/game/GameStatsTab';
import { GAMES_DATA } from '../../data/games.data';
import type { GameTab } from '../../types/gameTab.types';

const game = GAMES_DATA.find((g) => g.id === 'lol')!;

export function LolHomePage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<GameTab>('solo');

  return (
    <GameLandingLayout game={game} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'solo' && <GameSoloTab game={game} />}
      {activeTab === 'teams' && <GameTeamsTab game={game} />}
      {activeTab === 'stats' && <GameStatsTab game={game} />}
    </GameLandingLayout>
  );
}
