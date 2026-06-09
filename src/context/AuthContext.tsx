// Contexte d'authentification global.
// Gère l'état user/token, la réhydratation au montage et expose les actions.

import React, { createContext, useCallback, useEffect, useState } from 'react';

import {
  fetchMe,
  login as apiLogin,
  register as apiRegister,
  readStoredToken,
  removeStoredToken,
  writeStoredToken,
} from '../services/authApi';
import type { AuthStatus, User } from '../types/auth';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, pseudo: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/** Fournit le contexte d'auth à toute l'application. */
export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Réhydratation au montage : si un token est stocké, on récupère le profil frais.
  useEffect(() => {
    const stored = readStoredToken();
    if (!stored) {
      setStatus('anonymous');
      return;
    }

    fetchMe(stored)
      .then(({ user: fetchedUser }) => {
        setToken(stored);
        setUser(fetchedUser);
        setStatus('authenticated');
      })
      .catch(() => {
        // Token expiré ou invalide → nettoyer proprement.
        removeStoredToken();
        setStatus('anonymous');
      });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const data = await apiLogin(email, password);
    writeStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
    setStatus('authenticated');
  }, []);

  const register = useCallback(
    async (email: string, password: string, pseudo: string): Promise<void> => {
      // Le backend register renvoie { token, user } directement (HTTP 201).
      const data = await apiRegister(email, password, pseudo);
      writeStoredToken(data.token);
      setToken(data.token);
      setUser(data.user);
      setStatus('authenticated');
    },
    [],
  );

  const logout = useCallback((): void => {
    removeStoredToken();
    setToken(null);
    setUser(null);
    setStatus('anonymous');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
