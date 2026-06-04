import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import { LolHomePage } from '../pages/lol/LolHomePage';
import { LolPlayerPage } from '../pages/lol/LolPlayerPage';
import { ValorantHomePage } from '../pages/valorant/ValorantHomePage';
import { ValorantPlayerPage } from '../pages/valorant/ValorantPlayerPage';
import { TftHomePage } from '../pages/tft/TftHomePage';
import { TftPlayerPage } from '../pages/tft/TftPlayerPage';

export function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/lol" element={<LolHomePage />} />
        <Route path="/lol/player/:gameName/:tagLine" element={<LolPlayerPage />} />

        <Route path="/valorant" element={<ValorantHomePage />} />
        <Route path="/valorant/player/:gameName/:tagLine" element={<ValorantPlayerPage />} />

        <Route path="/tft" element={<TftHomePage />} />
        <Route path="/tft/player/:gameName/:tagLine" element={<TftPlayerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
