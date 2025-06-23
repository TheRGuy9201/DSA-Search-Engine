/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET: string
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_WELCOME_TEMPLATE_ID: string
  readonly VITE_EMAILJS_USER_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
