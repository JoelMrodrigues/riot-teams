/**
 * Validation côté client pour le formulaire d'inscription.
 * Règles identiques au backend ; centralisé ici pour éviter la duplication.
 */

export interface RegisterFormErrors {
  email?: string;
  password?: string;
  pseudo?: string;
  riotId?: string;
}

export interface RegisterFormValues {
  email: string;
  password: string;
  pseudo: string;
  riotId: string;
  isStaff: boolean;
}

/** Vérifie le format "gameName#tagLine" (1–16 caractères # 1–5 caractères). */
export function isValidRiotId(value: string): boolean {
  return /^.{1,16}#[a-zA-Z0-9]{1,5}$/.test(value.trim());
}

export function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Adresse email invalide.';
  }

  if (values.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
  } else if (values.password.length > 128) {
    errors.password = 'Le mot de passe ne peut pas dépasser 128 caractères.';
  }

  const trimmedPseudo = values.pseudo.trim();
  if (trimmedPseudo.length < 2) {
    errors.pseudo = 'Le pseudo doit contenir au moins 2 caractères.';
  } else if (trimmedPseudo.length > 32) {
    errors.pseudo = 'Le pseudo ne peut pas dépasser 32 caractères.';
  }

  if (!values.isStaff && values.riotId.trim() !== '') {
    if (!isValidRiotId(values.riotId)) {
      errors.riotId = 'Format invalide — utilise le format Pseudo#TAG.';
    }
  }

  return errors;
}
