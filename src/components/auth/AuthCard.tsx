// Coque visuelle partagée pour les pages Login et Register.
// Centrage + fond surface + bordure + titre.

import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../layout/BrandLogo';

interface AuthCardProps {
  title: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}: AuthCardProps): React.JSX.Element {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ background: 'var(--bg-base)' }}
    >
      <div
        className="w-full max-w-sm px-8 py-10 rounded-md flex flex-col gap-6"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* En-tête */}
        <div className="flex flex-col items-center gap-3">
          <BrandLogo size={36} radius="md" />
          <h1
            className="text-lg font-bold uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}
          >
            {title}
          </h1>
        </div>

        {/* Contenu (formulaire) */}
        {children}

        {/* Pied de carte */}
        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          {footerText}{' '}
          <Link
            to={footerLinkTo}
            className="transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: 'var(--brand-soft)' }}
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
