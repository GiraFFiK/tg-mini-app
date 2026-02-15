/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Для process.env (если используется)
declare const process: {
  env: {
    REACT_APP_API_URL?: string;
    NODE_ENV?: string;
  }
};