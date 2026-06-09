// Page d'inscription (/register).
// Valide email/password/pseudo côté client (règles identiques au backend).

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthCard } from '../../components/auth/AuthCard';
import { AuthFormField } from '../../components/auth/AuthFormField';
import { useAuth } from '../../hooks/useAuth';

interface FormErrors {
  email?: string;
  password?: string;
  pseudo?: string;
}

function validate(email: string, password: string, pseudo: string): FormErrors {
  const errors: FormErrors = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Adresse email invalide.';
  }
  if (password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
  }
  if (password.length > 128) {
    errors.password = 'Le mot de passe ne peut pas dépasser 128 caractères.';
  }
  const trimmedPseudo = pseudo.trim();
  if (trimmedPseudo.length < 2) {
    errors.pseudo = 'Le pseudo doit contenir au moins 2 caractères.';
  }
  if (trimmedPseudo.length > 32) {
    errors.pseudo = 'Le pseudo ne peut pas dépasser 32 caractères.';
  }
  return errors;
}

export function RegisterPage(): React.JSX.Element {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setApiError(null);

    const errors = validate(email, password, pseudo);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsPending(true);

    try {
      await register(email, password, pseudo);
      navigate('/', { replace: true });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erreur lors de la création du compte.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthCard
      title="Créer un compte"
      footerText="Déjà un compte ?"
      footerLinkLabel="Se connecter"
      footerLinkTo="/login"
    >
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4" noValidate>
        <AuthFormField
          id="reg-pseudo"
          label="Pseudo"
          type="text"
          value={pseudo}
          onChange={setPseudo}
          error={fieldErrors.pseudo}
          autoComplete="username"
          placeholder="ShadowVoid"
        />
        <AuthFormField
          id="reg-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <AuthFormField
          id="reg-password"
          label="Mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="new-password"
          placeholder="8 caractères minimum"
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
          {isPending ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>
    </AuthCard>
  );
}
