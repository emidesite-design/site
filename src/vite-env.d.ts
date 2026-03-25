/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: string;
  readonly VITE_SUPABASE_PRESSKIT_BUCKET?: string;
  readonly VITE_SUPABASE_PRESSKIT_FOLDER?: string;
  readonly VITE_SUPABASE_PRESSKIT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
