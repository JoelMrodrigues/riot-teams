// Page de connexion (/login).
// Valide email/password côté client, délègue à useAuth().login.

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { AuthCard } from '../../components/auth/AuthCard';
import { AuthFormField } from '../../components/auth/AuthFormField';
import { useAuth } from '../../hooks/useAuth';

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Adresse email invalide.';
  }
  if (!password) {
    errors.password = 'Mot de passe requis.';
  }
  return errors;
}

export function LoginPage(): React.JSX.Element {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Redirige après connexion : ?redirect=… (prioritaire) > state.from > accueil.
  const redirectParam = new URLSearchParams(location.search).get('redirect');
  const from = redirectParam ?? (location.state as { from?: string } | null)?.from ?? '/';

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setApiError(null);

    const errors = validate(email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsPending(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erreur de connexion.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthCard
      title="Connexion"
      footerText="Pas encore de compte ?"
      footerLinkLabel="Créer un compte"
      footerLinkTo="/register"
    >
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4" noValidate>
        <AuthFormField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <AuthFormField
          id="login-password"
          label="Mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        {apiError && (
          <p role="alert" className="text-xs text-center" style={{ color: 'var(--danger)' }}>
            {apiError}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-solid btn-md mt-1 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </AuthCard>
  );
}
