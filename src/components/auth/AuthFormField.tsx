// Champ de formulaire réutilisable (label + input + message d'erreur).

import React from 'react';

interface AuthFormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}

export function AuthFormField({
  id,
  label,
  type,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}: AuthFormFieldProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani, sans-serif' }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors duration-150"
        style={{
          background: 'var(--bg-elevated)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-default)'}`,
          color: 'var(--text-primary)',
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs"
          style={{ color: 'var(--danger)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
