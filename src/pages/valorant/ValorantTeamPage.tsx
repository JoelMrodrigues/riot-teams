import React from 'react';
import { useParams } from 'react-router-dom';

import { GamePageLayout } from '../../components/layout/GamePageLayout';
import { TeamDetailView } from '../../components/teams/TeamDetailView';
import { GAMES_DATA } from '../../data/games.data';

const game = GAMES_DATA.find((g) => g.id === 'valorant')!;

export function ValorantTeamPage(): React.JSX.Element {
  const { teamId } = useParams<{ teamId: string }>();

  return (
    <GamePageLayout game={game}>
      <TeamDetailView game={game} teamId={teamId!} />
    </GamePageLayout>
  );
}
