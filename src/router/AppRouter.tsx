import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import { TeamsPage } from '../pages/TeamsPage';

import { LolLayout } from '../components/lol/layout/LolLayout';
import { LolHomePage } from '../pages/lol/LolHomePage';
import { LolSearchPage } from '../pages/lol/LolSearchPage';
import { LolTeamsHomePage } from '../pages/lol/LolTeamsHomePage';
import { LolStatsPage } from '../pages/lol/LolStatsPage';

import { GameLandingPage } from '../pages/game/GameLandingPage';
import { GamePlayerPage } from '../pages/game/GamePlayerPage';
import { GameTeamPage } from '../pages/game/GameTeamPage';

export function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teams" element={<TeamsPage />} />

        {/* Écosystème LoL dédié — header/layout persistant via Outlet */}
        <Route path="/lol" element={<LolLayout />}>
          <Route index element={<LolHomePage />} />
          <Route path="search" element={<LolSearchPage />} />
          <Route path="teams" element={<LolTeamsHomePage />} />
          <Route path="stats" element={<LolStatsPage />} />
        </Route>
        <Route path="/lol/player/:gameName/:tagLine" element={<GamePlayerPage gameId="lol" phaseLabel="Phase 4" />} />
        <Route path="/lol/team/:teamId" element={<GameTeamPage gameId="lol" />} />

        <Route path="/valorant" element={<GameLandingPage gameId="valorant" />} />
        <Route path="/valorant/player/:gameName/:tagLine" element={<GamePlayerPage gameId="valorant" phaseLabel="Phase 4/5" />} />
        <Route path="/valorant/team/:teamId" element={<GameTeamPage gameId="valorant" />} />

        <Route path="/tft" element={<GameLandingPage gameId="tft" />} />
        <Route path="/tft/player/:gameName/:tagLine" element={<GamePlayerPage gameId="tft" phaseLabel="Phase 6" />} />
        <Route path="/tft/team/:teamId" element={<GameTeamPage gameId="tft" />} />
      </Routes>
    </BrowserRouter>
  );
}
