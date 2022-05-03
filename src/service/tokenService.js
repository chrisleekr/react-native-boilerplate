import * as Keychain from 'react-native-keychain';

class TokenService {
  async getAccessToken() {
    try {
      const value = await Keychain.getGenericPassword();

      const jwt = JSON.parse(value.password);

      return jwt.accessToken;
    } catch (_e) {
      return undefined;
    }
  }

  async getRefreshToken() {
    try {
      const value = await Keychain.getGenericPassword();
      const jwt = JSON.parse(value.password);

      return jwt.refreshToken;
    } catch (_e) {
      return undefined;
    }
  }

  async updateToken(token) {
    try {
      await Keychain.setGenericPassword('token', JSON.stringify(token));
      return true;
    } catch (_e) {
      return false;
    }
  }

  async loadToken() {
    try {
      const value = await Keychain.getGenericPassword();

      const jwt = JSON.parse(value.password);

      return jwt;
    } catch (_e) {
      return undefined;
    }
  }

  async resetToken() {
    try {
      await Keychain.resetGenericPassword();
      return true;
    } catch (_e) {
      return false;
    }
  }
}

export default new TokenService();
