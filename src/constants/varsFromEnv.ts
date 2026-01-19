const {
  VITE_API_VERSION,
  VITE_API_URL,
  VITE_CORS_PROXY_URL,
  VITE_LOCAL_CLIENT_PREFIX,
  VITE_LOG_LEVELS,
} = import.meta.env;

const MODE
  = import.meta.env.MODE as 'development' | 'production';

export const env: {
  DEV_MODE: boolean,
  API_URL: string;
  CORS_PROXY_URL: string;
  LOCAL_CLIENT_PREFIX: string;
  LOG_LEVELS: Array<string>;
  // MAX_IMAGE_SIZE: number;
} = Object.freeze({
  DEV_MODE:
    MODE === 'development',

  API_URL: {
    development: `http://localhost:3005${VITE_API_VERSION}`,
    production: `${VITE_API_URL}${VITE_API_VERSION}`,
  }[MODE],

  CORS_PROXY_URL:
    VITE_CORS_PROXY_URL
    || '',

  LOCAL_CLIENT_PREFIX:
    VITE_LOCAL_CLIENT_PREFIX
    || 'TASK_MANAGER_',

  LOG_LEVELS: ({
    development: 'DEBUG,INFO,WARN,ERROR',
    production: VITE_LOG_LEVELS,
  }[MODE]
    ?? 'DEBUG,INFO,WARN,ERROR')
    .toUpperCase()
    .split(/\s*[\,\.\s]\s*/g), /* eslint-disable-line no-useless-escape */
});
