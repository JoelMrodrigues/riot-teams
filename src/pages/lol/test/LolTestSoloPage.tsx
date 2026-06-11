import React from 'react';
import { motion } from 'framer-motion';

import { ProfileView } from '../../../components/lol/search/ProfileView';
import { DEMO_PROFILE } from '../../../data/lolDemoProfile.data';
import { DEMO_MATCH_DETAIL } from '../../../data/lolDemoMatch.data';
import { DEMO_TIMELINE } from '../../../data/lolDemoTimeline.data';
import { LOL_ACCENTS } from '../../../constants/lolTheme';

/** Espace test — profil Solo (mock) ; clic sur une partie = détail déroulant (mock). */
export function LolTestSoloPage(): React.JSX.Element {
  return (
    <motion.div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <span
        className="w-fit rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest"
        style={{ fontFamily: 'Rajdhani, sans-serif', background: `${LOL_ACCENTS.solo.color}1A`, border: `1px solid ${LOL_ACCENTS.solo.color}40`, color: LOL_ACCENTS.solo.color }}
      >
        Espace test · Solo — clique une partie pour déplier le détail
      </span>

      <ProfileView
        profile={DEMO_PROFILE}
        loadDetail={() => Promise.resolve(DEMO_MATCH_DETAIL)}
        loadTimeline={() => Promise.resolve(DEMO_TIMELINE)}
      />
    </motion.div>
  );
}
