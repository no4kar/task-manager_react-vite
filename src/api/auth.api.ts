import { getClient, onReq, onRes } from '../utils/axios.client';
import { env } from '../constants/varsFromEnv';
import { TyAuth } from '../types/Auth.type';

const client = getClient({
  baseURL: `${env.API_URL}/auth`,
});

export const authApi = {
  async registrationByGoogle() {
    return client.get('/google')
      .then(onRes.obtainData);
  },

  async registration({
    email,
    password,
  }: TyAuth.Request.Registration
  ) {
    return client.post('/registration', { email, password })
      .then<TyAuth.Response.Registration>(onRes.obtainData);
  },

  async activation(
    activationToken: TyAuth.Request.Activation
  ) {
    return client.get(`/activate/${activationToken}`)
      .then<TyAuth.Response.Activation>(onRes.obtainData);
  },

  async refresh() {
    return client.get(`/refresh`)
      .then<TyAuth.Response.Refresh>(onRes.obtainData);
  },

  async login(props: TyAuth.Request.Login
  ) {
    return client.post('/login', props)
      .then<TyAuth.Response.Login>(onRes.obtainData);
  },

  async logout() {
    return client.post('/logout')
      .then<void>(onRes.obtainData);
  },
};

client.interceptors.request.use(onReq.stickAccessToken);
client.interceptors.response.use(
  onRes.toConsoleInfo,
  onRes.handleUnauthorizedError(client, authApi.refresh));
