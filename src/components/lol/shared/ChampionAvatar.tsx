import React, { useState } from 'react';

import { championIcon } from '../../../utils/lolAssets';

interface ChampionAvatarProps {
  champKey: string;
  label: string;
  size?: number;
  ring?: string;
}

/** Avatar champion (Data Dragon) avec anneau gradient et fallback initiale. */
export function ChampionAvatar({ champKey, label, size = 44, ring }: ChampionAvatarProps): React.JSX.Element {
  const [ok, setOk] = useState(true);

  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-md"
      style={{
        width: size,
        height: size,
        background: ring ?? 'var(--lol-violet-strong)',
        padding: '2px',
      }}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[4px]" style={{ background: 'var(--lol-bg-elevated)' }}>
        {ok ? (
          <img
            src={championIcon(champKey)}
            alt={label}
            draggable={false}
            onError={() => setOk(false)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)', fontSize: size * 0.4 }}>
            {label.charAt(0)}
          </span>
        )}
      </div>
    </div>
  );
}
