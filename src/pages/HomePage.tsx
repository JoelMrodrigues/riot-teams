import React from 'react';
import { Header } from '../components/layout/Header';
import { HeroSection } from '../components/home/HeroSection';

export function HomePage(): React.JSX.Element {
  return (
    <main className="relative w-full h-full">
      <Header />
      <HeroSection />
    </main>
  );
}
