import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import { TeamsPage } from '../pages/TeamsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

import { LolLayout } from '../components/lol/layout/LolLayout';
import { LolHomePage } from '../pages/lol/LolHomePage';
import { LolSearchPage } from '../pages/lol/LolSearchPage';
import { LolTeamsHomePage } from '../pages/lol/LolTeamsHomePage';
import { LolTeamDetailPage } from '../pages/lol/LolTeamDetailPage';
import { LolStatsPage } from '../pages/lol/LolStatsPage';
import { LolPlayerRedirect } from '../components/lol/LolPlayerRedirect';

import { GameLandingPage } from '../pages/game/GameLandingPage';
import { GamePlayerPage } from '../pages/game/GamePlayerPage';
import { GameTeamPage } from '../pages/game/GameTeamPage';

export function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Écosystème LoL dédié — header/layout persistant via Outlet */}
        <Route path="/lol" element={<LolLayout />}>
          <Route index element={<LolHomePage />} />
          <Route path="search" element={<LolSearchPage />} />
          <Route path="teams" element={<LolTeamsHomePage />} />
          <Route path="stats" element={<LolStatsPage />} />
          {/*
           * /lol/player/:gameName/:tagLine est maintenant DANS LolLayout.
           * LolPlayerRedirect fait un <Navigate> vers /lol/search?riotId=...
           * → une seule expérience profil, cohérente, dans la coquille LoL.
           */}
          <Route path="player/:gameName/:tagLine" element={<LolPlayerRedirect />} />
          <Route path="team/:teamId" element={<LolTeamDetailPage />} />
        </Route>

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
