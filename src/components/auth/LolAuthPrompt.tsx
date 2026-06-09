import React from 'react';
import { Link } from 'react-router-dom';

interface LolAuthPromptProps {
  /** Message d'invitation contextuel. */
  message?: string;
}

/**
 * Bloc d'invitation à se connecter — affiché quand l'utilisateur est anonyme
 * et tente d'accéder à une fonctionnalité réservée (équipes, création, etc.).
 */
export function LolAuthPrompt({ message }: LolAuthPromptProps): React.JSX.Element {
  const text = message ?? 'Connecte-toi pour gérer tes équipes LoL.';

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-sm border p-8 text-center"
      style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
    >
      <p
        className="text-sm"
        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        {text}
      </p>
      <Link
        to="/login"
        className="btn btn-solid btn-sm"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        Se connecter →
      </Link>
    </div>
  );
}
