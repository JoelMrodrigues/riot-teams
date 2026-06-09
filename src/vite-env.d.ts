/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base de l'API backend. Vide = même origine (proxy Vite en dev / build servi par l'API en prod) ; sinon URL distante (ex. backend Hetzner). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
