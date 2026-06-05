import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import { TeamsPage } from '../pages/TeamsPage';

import { LolLayout } from '../components/lol/layout/LolLayout';
import { LolHomePage } from '../pages/lol/LolHomePage';
import { LolSearchPage } from '../pages/lol/LolSearchPage';
import { LolTeamsHomePage } from '../pages/lol/LolTeamsHomePage';
import { LolPlayerPage } from '../pages/lol/LolPlayerPage';
import { LolTeamPage } from '../pages/lol/LolTeamPage';

import { ValorantHomePage } from '../pages/valorant/ValorantHomePage';
import { ValorantPlayerPage } from '../pages/valorant/ValorantPlayerPage';
import { ValorantTeamPage } from '../pages/valorant/ValorantTeamPage';

import { TftHomePage } from '../pages/tft/TftHomePage';
import { TftPlayerPage } from '../pages/tft/TftPlayerPage';
import { TftTeamPage } from '../pages/tft/TftTeamPage';

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
        </Route>
        <Route path="/lol/player/:gameName/:tagLine" element={<LolPlayerPage />} />
        <Route path="/lol/team/:teamId" element={<LolTeamPage />} />

        <Route path="/valorant" element={<ValorantHomePage />} />
        <Route path="/valorant/player/:gameName/:tagLine" element={<ValorantPlayerPage />} />
        <Route path="/valorant/team/:teamId" element={<ValorantTeamPage />} />

        <Route path="/tft" element={<TftHomePage />} />
        <Route path="/tft/player/:gameName/:tagLine" element={<TftPlayerPage />} />
        <Route path="/tft/team/:teamId" element={<TftTeamPage />} />
      </Routes>
    </BrowserRouter>
  );
}
