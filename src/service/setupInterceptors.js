import api from './api';
import TokenService from './tokenService';

const setupInterceptors = _store => {
  api.interceptors.request.use(
    async config => {
      const token = await TokenService.getAccessToken();

      if (token) {
        config.headers.Authorization = token;
      }

      return config;
    },
    error => Promise.reject(error)
  );

  api.interceptors.response.use(
    res => {
      return res;
    },
    async err => {
      const originalConfig = err.config;

      if (originalConfig.url !== '/user/login' && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const response = await api.post('/refresh-token', {
              refreshToken: await TokenService.getRefreshToken()
            });
            const {data} = response.data;

            await TokenService.updateToken({
              accessToken: data.auth_key,
              refreshToken: data.refresh_auth_key
            });

            return api(originalConfig);
          } catch (error) {
            return Promise.reject(error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setupInterceptors;
