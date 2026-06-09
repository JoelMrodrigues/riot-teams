// Hook d'accès au contexte d'authentification.
// Lance une erreur claire si utilisé hors du AuthProvider.

import { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';
import type { AuthContextValue } from '../context/AuthContext';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
