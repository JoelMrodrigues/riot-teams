import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Classe Tailwind max-w-* pour la largeur interne. Défaut : 'max-w-md'. */
  maxWidth?: string;
  /** Si true, supprime le padding p-7 et gap-6 internes — utile pour les modals gérant leur propre layout. */
  noPadding?: boolean;
  /** Styles appliqués au panneau — sert à réinjecter un thème scopé (ex. vars `--lol-*`) dans le portal. */
  panelStyle?: React.CSSProperties;
}

/**
 * Shell de modale partagé : rendu via `createPortal` sur `document.body`
 * (indispensable pour échapper aux `transform` des parents animés), overlay
 * cliquable, animation d'entrée/sortie et fermeture au clavier (Escape).
 * `panelStyle` permet de réinjecter des variables CSS de thème (le portal est
 * hors de l'arbre DOM d'origine, donc ne les hérite pas).
 */
export function BaseModal({ isOpen, onClose, children, maxWidth = 'max-w-md', noPadding = false, panelStyle }: BaseModalProps): React.JSX.Element {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              className={`w-full ${maxWidth} rounded-sm ${noPadding ? 'overflow-hidden' : 'p-7 flex flex-col gap-6'}`}
              style={{
                background: 'var(--bg-modal)',
                border: '1px solid var(--border-default)',
                ...panelStyle,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
