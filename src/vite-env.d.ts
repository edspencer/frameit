/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POSTHOG_API_KEY?: string
  readonly VITE_POSTHOG_HOST?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posthog?: any
}
