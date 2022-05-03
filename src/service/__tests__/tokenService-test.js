import * as Keychain from 'react-native-keychain';
import tokenService from '../tokenService';

let response;
describe('tokenService', () => {
  describe('getAccessToken', () => {
    describe('success', () => {
      beforeEach(async () => {
        Keychain.getGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.resolve({
            password: JSON.stringify({
              accessToken: 'my-access-token'
            })
          });
        });

        response = await tokenService.getAccessToken();
      });

      it('returns expected value', () => {
        expect(response).toBe('my-access-token');
      });
    });

    describe('failed', () => {
      beforeEach(async () => {
        Keychain.getGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.reject(new Error('error'));
        });
        response = await tokenService.getAccessToken();
      });

      it('returns expected value', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('getRefreshToken', () => {
    describe('success', () => {
      beforeEach(async () => {
        Keychain.getGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.resolve({
            password: JSON.stringify({
              refreshToken: 'my-refresh-token'
            })
          });
        });

        response = await tokenService.getRefreshToken();
      });

      it('returns expected value', () => {
        expect(response).toBe('my-refresh-token');
      });
    });

    describe('failed', () => {
      beforeEach(async () => {
        Keychain.getGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.reject(new Error('error'));
        });
        response = await tokenService.getRefreshToken();
      });

      it('returns expected value', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('updateToken', () => {
    describe('success', () => {
      beforeEach(async () => {
        Keychain.setGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.resolve(true);
        });

        response = await tokenService.updateToken('my-new-token');
      });

      it('triggers Keychain.setGenericPassword', () => {
        expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
          'token',
          JSON.stringify('my-new-token')
        );
      });

      it('returns expected value', () => {
        expect(response).toBeTruthy();
      });
    });

    describe('failed', () => {
      beforeEach(async () => {
        Keychain.setGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.reject(new Error('error'));
        });
        response = await tokenService.updateToken('my-new-token');
      });

      it('returns expected value', () => {
        expect(response).toBeFalsy();
      });
    });
  });

  describe('loadToken', () => {
    describe('success', () => {
      beforeEach(async () => {
        Keychain.getGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.resolve({
            password: JSON.stringify({
              accessToken: 'my-access-token',
              refreshToken: 'my-refresh-token'
            })
          });
        });

        response = await tokenService.loadToken();
      });

      it('returns expected value', () => {
        expect(response).toStrictEqual({
          accessToken: 'my-access-token',
          refreshToken: 'my-refresh-token'
        });
      });
    });

    describe('failed', () => {
      beforeEach(async () => {
        Keychain.getGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.reject(new Error('error'));
        });
        response = await tokenService.loadToken();
      });

      it('returns expected value', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('resetToken', () => {
    describe('success', () => {
      beforeEach(async () => {
        Keychain.resetGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.resolve(true);
        });

        response = await tokenService.resetToken();
      });

      it('returns expected value', () => {
        expect(response).toBeTruthy();
      });
    });

    describe('failed', () => {
      beforeEach(async () => {
        Keychain.resetGenericPassword = jest.fn().mockImplementation(() => {
          return Promise.reject(new Error('error'));
        });
        response = await tokenService.resetToken();
      });

      it('returns expected value', () => {
        expect(response).toBeFalsy();
      });
    });
  });
});
