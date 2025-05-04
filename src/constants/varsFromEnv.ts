export const env: {
  DEV_MODE: boolean,
  API_URL: string;
  CORS_PROXY_URL: string;
  LOCAL_CLIENT_PREFIX: string;
  LOG_LEVELS: Array<string>;
} = Object.freeze({
  DEV_MODE:
    import.meta.env.MODE === 'development',

  API_URL: {
    development: 'http://localhost:3005',
    production: import.meta.env.VITE_API_URL,
  }[import.meta.env.MODE],

  CORS_PROXY_URL:
    import.meta.env.VITE_CORS_PROXY_URL
    || '',

  LOCAL_CLIENT_PREFIX:
    import.meta.env.VITE_LOCAL_CLIENT_PREFIX
    || 'TASK_MANAGER_',

  LOG_LEVELS:
    (import.meta.env.VITE_LOG_LEVELS || '')
      .toUpperCase()
      .split(/\s*[\,\.\s]\s*/g), /* eslint-disable-line no-useless-escape */
});
