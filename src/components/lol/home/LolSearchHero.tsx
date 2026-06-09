import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { RiotIdSearch } from '../search/RiotIdSearch';
import { parseRiotId } from '../../../utils/riotId';

interface LolSearchHeroProps {
  onSearch: (riotId: string, tagLine: string) => void;
}

/**
 * Zone A — point d'entrée principal : titre court + barre de recherche Riot ID.
 * Dense, sans hero pleine hauteur. Fade-in à l'entrée.
 */
export function LolSearchHero({ onSearch }: LolSearchHeroProps): React.JSX.Element {
  const navigate = useNavigate();

  const handleSearch = (input: string): void => {
    const parsed = parseRiotId(input);
    if (!parsed) return;
    onSearch(parsed.gameName, parsed.tagLine);
    const encoded = encodeURIComponent(`${parsed.gameName}#${parsed.tagLine}`);
    navigate(`/lol/search?riotId=${encoded}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="pt-8 pb-4"
      aria-label="Recherche de joueur"
    >
      <p
        className="mb-1 text-xs font-bold uppercase tracking-[0.15em]"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
      >
        League of Legends · Hub
      </p>
      <h1
        className="mb-4 text-2xl font-bold md:text-3xl"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
      >
        Recherche un joueur
      </h1>
      <RiotIdSearch onSearch={handleSearch} loading={false} />
    </motion.section>
  );
}

