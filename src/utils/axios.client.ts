import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { accessTokenApi } from '../api/accessToken.api';
import { TyAuth } from '../types/Auth.type';
import { logger } from './logger';

type AxiosErrorResponse
  = AxiosError<{
    message: string;
    error: string;
  }>;

export function getClient(
  config: CreateAxiosDefaults<unknown>)
  : AxiosInstance {
  return axios.create(config);
}

export const onReq = {
  stickAccessToken<T>(req: InternalAxiosRequestConfig<T>) {
    const accessToken = accessTokenApi.get();

    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
      req.withCredentials = true;
    }

    return req;
  },
}

export const onRes = {
  obtainData<T>(res: AxiosResponse<T>) {
    return res.data;
  },

  toConsoleInfo<T>(res: T) {
    logger.info(res);

    return res;
  },

  handleUnauthorizedError(
    client: AxiosInstance,
    refresh: () => Promise<TyAuth.Response.Refresh>,
  ) {
    // prevent infinity loop
    let firstRequest = true;

    return async (
      error: AxiosErrorResponse
    ): Promise<AxiosResponse | never> => {
      if (error.response?.status !== 401
        || !firstRequest) {
        firstRequest = true;
        throw axiosErrorToError(error);
      }

      firstRequest = false;

      try {
        const originalRequest
          = error.config;

        if (!originalRequest) {
          throw new Error('Original request config is missing in Axios error.');
        }

        const {
          accessToken
        } = await refresh();

        accessTokenApi.save(accessToken);
        return client.request(originalRequest);
      } catch (error: unknown) {
        throw axiosErrorToError(error as AxiosErrorResponse);
      }
    };
  },
}

function axiosErrorToError(
  error: AxiosErrorResponse,
) {
  return {
    code: `${error.response?.status} ${error.code}`,
    message: error.response?.data?.message,
    name: error.name,
    stack: `
    CLIENT:
    ${error.stack}

    SERVER:
    ${error.response?.data.error}`,
  };
}
