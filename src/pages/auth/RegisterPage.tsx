// Page d'inscription (/register).
// Délègue la validation à registerValidation.ts et le bloc Riot ID à RegisterRiotIdField.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthCard } from '../../components/auth/AuthCard';
import { AuthFormField } from '../../components/auth/AuthFormField';
import { RegisterRiotIdField } from '../../components/auth/RegisterRiotIdField';
import { useAuth } from '../../hooks/useAuth';
import { validateRegisterForm } from '../../utils/registerValidation';
import type { RegisterFormErrors } from '../../utils/registerValidation';

export function RegisterPage(): React.JSX.Element {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo]     = useState('');
  const [riotId, setRiotId]     = useState('');
  const [isStaff, setIsStaff]   = useState(false);

  const [fieldErrors, setFieldErrors] = useState<RegisterFormErrors>({});
  const [apiError, setApiError]       = useState<string | null>(null);
  const [isPending, setIsPending]     = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setApiError(null);

    const errors = validateRegisterForm({ email, password, pseudo, riotId, isStaff });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsPending(true);

    try {
      const riotIdTrimmed = riotId.trim();
      await register(email, password, pseudo, {
        riotId: !isStaff && riotIdTrimmed !== '' ? riotIdTrimmed : undefined,
        noRiotId: isStaff,
      });
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

        <RegisterRiotIdField
          riotId={riotId}
          isStaff={isStaff}
          error={fieldErrors.riotId}
          onRiotIdChange={setRiotId}
          onIsStaffChange={setIsStaff}
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
