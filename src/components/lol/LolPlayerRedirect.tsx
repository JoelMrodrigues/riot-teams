import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

interface PlayerParams {
  gameName: string;
  tagLine: string;
  [key: string]: string | undefined;
}

/**
 * Redirige /lol/player/:gameName/:tagLine → /lol/search?riotId=...
 * Permet aux liens existants (LolRecentSearches, liens externes) de continuer
 * à fonctionner sans casser le LolLayout.
 * Les routes /valorant/player et /tft/player continuent d'utiliser GamePlayerPage.
 */
export function LolPlayerRedirect(): React.JSX.Element {
  const { gameName, tagLine } = useParams<PlayerParams>();

  const name = decodeURIComponent(gameName ?? '');
  const tag = decodeURIComponent(tagLine ?? '');
  const riotId = encodeURIComponent(`${name}#${tag}`);

  return <Navigate to={`/lol/search?riotId=${riotId}`} replace />;
}
