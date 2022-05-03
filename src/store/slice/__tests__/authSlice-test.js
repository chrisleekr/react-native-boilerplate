import api from '../../../service/api';
import TokenService from '../../../service/tokenService';

import store from '../../store';

import {
  setState,
  initialise,
  logout,
  resetErrors,
  login,
  register,
  passwordResetRequest
} from '../authSlice';

let state;
let mockPost;

describe('authSlice', () => {
  describe('initialise', () => {
    describe('when loadToken returns undefined', () => {
      beforeEach(() => {
        TokenService.loadToken = jest.fn(fn => fn());

        store.dispatch(initialise());

        state = store.getState().auth;
      });

      it('sets accessToken', () => {
        expect(state.accessToken).toBe('');
      });

      it('sets refreshToken', () => {
        expect(state.refreshToken).toBe('');
      });

      it('sets isAuthenticated', () => {
        expect(state.isAuthenticated).toBeFalsy();
      });
    });

    describe('when loadToken returned', () => {
      beforeEach(async () => {
        TokenService.loadToken = jest.fn(fn =>
          fn({
            accessToken: 'my-access-token',
            refreshToken: 'my-refresh-token'
          })
        );

        store.dispatch(initialise());
        state = store.getState().auth;
      });

      it('sets accessToken', () => {
        expect(state.accessToken).toBe('my-access-token');
      });

      it('sets refreshToken', () => {
        expect(state.refreshToken).toBe('my-refresh-token');
      });

      it('sets isAuthenticated', () => {
        expect(state.isAuthenticated).toBeTruthy();
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      TokenService.resetToken = jest.fn();
      TokenService.loadToken = jest.fn(fn =>
        fn({
          accessToken: 'my-access-token',
          refreshToken: 'my-refresh-token'
        })
      );

      // Login to fill up the state
      store.dispatch(initialise());

      // Logout to test
      store.dispatch(logout());

      state = store.getState().auth;
    });

    it('triggers resetToken', () => {
      expect(TokenService.resetToken).toHaveBeenCalled();
    });

    it('sets errors', () => {
      expect(state.errors).toStrictEqual([]);
    });

    it('sets isAuthenticated', () => {
      expect(state.isAuthenticated).toBeFalsy();
    });

    it('sets accessToken', () => {
      expect(state.accessToken).toBe('');
    });

    it('sets refreshToken', () => {
      expect(state.refreshToken).toBe('');
    });
  });

  describe('resetErrors', () => {
    beforeEach(() => {
      store.dispatch(setState({key: 'errors', value: ['some existing error']}));

      store.dispatch(resetErrors());

      state = store.getState().auth;
    });

    it('sets errors', () => {
      expect(state.errors).toStrictEqual([]);
    });
  });

  describe('login', () => {
    describe('when fulfilled', () => {
      beforeEach(async () => {
        mockPost = jest.fn().mockResolvedValue({
          data: {
            status: 200,
            data: {
              auth_key: 'my-access-token',
              refresh_auth_key: 'my-refresh-token'
            }
          }
        });
        jest.spyOn(api, 'post').mockImplementation(mockPost);

        // Mock updateToken
        TokenService.updateToken = jest.fn();

        // To reset state
        store.dispatch(logout());

        await store.dispatch(
          login({username: 'my-username', password: 'my-password'})
        );

        state = store.getState().auth;
      });

      it('triggers api.post', () => {
        expect(mockPost).toHaveBeenCalledWith('/user/login', {
          username: 'my-username',
          password: 'my-password'
        });
      });

      it('sets accessToken', () => {
        expect(state.accessToken).toBe('my-access-token');
      });

      it('sets refreshToken', () => {
        expect(state.refreshToken).toBe('my-refresh-token');
      });

      it('sets isAuthenticated', () => {
        expect(state.isAuthenticated).toBeTruthy();
      });

      it('triggers updateToken', () => {
        expect(TokenService.updateToken).toHaveBeenCalledWith({
          accessToken: 'my-access-token',
          refreshToken: 'my-refresh-token'
        });
      });
    });

    describe('when rejected', () => {
      describe('when there is a response', () => {
        beforeEach(async () => {
          mockPost = jest.fn().mockRejectedValue({
            response: {
              status: 422,
              data: {
                data: [
                  {
                    msg: 'validation error'
                  }
                ]
              }
            }
          });
          jest.spyOn(api, 'post').mockImplementation(mockPost);

          // Mock updateToken
          TokenService.updateToken = jest.fn();

          // To reset state
          store.dispatch(logout());

          // Test login
          await store.dispatch(
            login({username: 'my-username', password: 'my-password'})
          );

          state = store.getState().auth;
        });

        it('does not set accessToken', () => {
          expect(state.accessToken).toBe('');
        });

        it('does not set refreshToken', () => {
          expect(state.refreshToken).toBe('');
        });

        it('does not set isAuthenticated', () => {
          expect(state.isAuthenticated).toBeFalsy();
        });

        it('does not trigger updateToken', () => {
          expect(TokenService.updateToken).not.toHaveBeenCalled();
        });

        it('sets errors', () => {
          expect(state.errors).toStrictEqual(['validation error']);
        });
      });

      describe('when there is no response', () => {
        beforeEach(async () => {
          mockPost = jest
            .fn()
            .mockRejectedValue(new Error('something happened'));
          jest.spyOn(api, 'post').mockImplementation(mockPost);

          // Mock updateToken
          TokenService.updateToken = jest.fn();

          // To reset state
          store.dispatch(logout());

          // Test login
          await store.dispatch(
            login({username: 'my-username', password: 'my-password'})
          );

          state = store.getState().auth;
        });

        it('does not set accessToken', () => {
          expect(state.accessToken).toBe('');
        });

        it('does not set refreshToken', () => {
          expect(state.refreshToken).toBe('');
        });

        it('does not set isAuthenticated', () => {
          expect(state.isAuthenticated).toBeFalsy();
        });

        it('does not trigger updateToken', () => {
          expect(TokenService.updateToken).not.toHaveBeenCalled();
        });

        it('sets errors', () => {
          expect(state.errors).toStrictEqual(['Request error occurred.']);
        });
      });
    });

    describe('when request is fired before finishing the initial request', () => {
      beforeEach(async () => {
        mockPost = jest.fn().mockImplementation(() => {
          return new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    status: 200,
                    data: {
                      auth_key: '1st-access-token',
                      refresh_auth_key: '1st-refresh-token'
                    }
                  }
                }),
              100
            )
          );
        });
        jest.spyOn(api, 'post').mockImplementation(mockPost);

        // Mock updateToken
        TokenService.updateToken = jest.fn();

        // To reset state
        store.dispatch(logout());

        await Promise.all([
          // Fire initial request
          store.dispatch(
            login({username: 'my-username', password: 'my-password'})
          ),

          // Fire second request
          store.dispatch(
            login({username: 'my-username', password: 'my-password'})
          )
        ]);

        state = store.getState().auth;
      });

      it('triggers api.post only once', () => {
        expect(api.post).toHaveBeenCalledTimes(1);
      });

      it('sets accessToken', () => {
        expect(state.accessToken).toBe('1st-access-token');
      });

      it('sets refreshToken', () => {
        expect(state.refreshToken).toBe('1st-refresh-token');
      });

      it('sets isAuthenticated', () => {
        expect(state.isAuthenticated).toBeTruthy();
      });

      it('triggers updateToken', () => {
        expect(TokenService.updateToken).toHaveBeenCalledWith({
          accessToken: '1st-access-token',
          refreshToken: '1st-refresh-token'
        });
      });
    });
  });

  describe('register', () => {
    describe('when fulfilled', () => {
      beforeEach(async () => {
        // Set register to return correctly
        mockPost = jest.fn().mockResolvedValue({
          data: {
            status: 200,
            data: {
              result: true
            }
          }
        });
        jest.spyOn(api, 'post').mockImplementation(mockPost);

        // To reset state
        store.dispatch(logout());

        await store.dispatch(
          register({
            email: 'my@email.com',
            username: 'my-username',
            password: 'my-password',
            firstName: 'first-name',
            lastName: 'last-name'
          })
        );

        state = store.getState().auth;
      });

      it('triggers api.post', () => {
        expect(mockPost).toHaveBeenCalledWith('/user/register', {
          email: 'my@email.com',
          username: 'my-username',
          password: 'my-password',
          first_name: 'first-name',
          last_name: 'last-name'
        });
      });
    });

    describe('when rejected', () => {
      describe('when there is a response', () => {
        beforeEach(async () => {
          mockPost = jest.fn().mockRejectedValue({
            response: {
              status: 422,
              data: {
                data: [
                  {
                    msg: 'validation error'
                  }
                ]
              }
            }
          });
          jest.spyOn(api, 'post').mockImplementation(mockPost);

          // To reset state
          store.dispatch(logout());

          // Test register
          await store.dispatch(
            register({
              email: 'my@email.com',
              username: 'my-username',
              password: 'my-password',
              firstName: 'first-name',
              lastName: 'last-name'
            })
          );

          state = store.getState().auth;
        });

        it('sets errors', () => {
          expect(state.errors).toStrictEqual(['validation error']);
        });
      });

      describe('when there is no response', () => {
        beforeEach(async () => {
          mockPost = jest
            .fn()
            .mockRejectedValue(new Error('something happened'));
          jest.spyOn(api, 'post').mockImplementation(mockPost);

          // To reset state
          store.dispatch(logout());

          // Test register
          await store.dispatch(
            register({
              email: 'my@email.com',
              username: 'my-username',
              password: 'my-password',
              firstName: 'first-name',
              lastName: 'last-name'
            })
          );

          state = store.getState().auth;
        });

        it('sets errors', () => {
          expect(state.errors).toStrictEqual(['Request error occurred.']);
        });
      });
    });

    describe('when request is fired before finishing the initial request', () => {
      beforeEach(async () => {
        mockPost = jest.fn().mockImplementation(() => {
          return new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    status: 200,
                    data: {
                      result: true
                    }
                  }
                }),
              100
            )
          );
        });
        jest.spyOn(api, 'post').mockImplementation(mockPost);

        // To reset state
        store.dispatch(logout());

        await Promise.all([
          // Fire initial request
          store.dispatch(
            register({
              email: 'my@email.com',
              username: 'my-username',
              password: 'my-password',
              firstName: 'first-name',
              lastName: 'last-name'
            })
          ),

          // Fire second request
          store.dispatch(
            register({
              email: 'my@email.com',
              username: 'my-username',
              password: 'my-password',
              firstName: 'first-name',
              lastName: 'last-name'
            })
          )
        ]);

        state = store.getState().auth;
      });

      it('triggers api.post only once', () => {
        expect(api.post).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('passwordResetRequest', () => {
    describe('when fulfilled', () => {
      beforeEach(async () => {
        // Set register to return correctly
        mockPost = jest.fn().mockResolvedValue({
          data: {
            status: 200,
            data: {
              result: true
            }
          }
        });
        jest.spyOn(api, 'post').mockImplementation(mockPost);

        // To reset state
        store.dispatch(logout());

        await store.dispatch(
          passwordResetRequest({
            email: 'my@email.com'
          })
        );

        state = store.getState().auth;
      });

      it('triggers api.post', () => {
        expect(mockPost).toHaveBeenCalledWith('/user/password-reset-request', {
          email: 'my@email.com'
        });
      });
    });

    describe('when rejected', () => {
      describe('when there is a response', () => {
        beforeEach(async () => {
          mockPost = jest.fn().mockRejectedValue({
            response: {
              status: 422,
              data: {
                data: [
                  {
                    msg: 'validation error'
                  }
                ]
              }
            }
          });
          jest.spyOn(api, 'post').mockImplementation(mockPost);

          // To reset state
          store.dispatch(logout());

          // Test register
          await store.dispatch(
            passwordResetRequest({
              email: 'my@email.com'
            })
          );

          state = store.getState().auth;
        });

        it('sets errors', () => {
          expect(state.errors).toStrictEqual(['validation error']);
        });
      });

      describe('when there is no response', () => {
        beforeEach(async () => {
          mockPost = jest
            .fn()
            .mockRejectedValue(new Error('something happened'));
          jest.spyOn(api, 'post').mockImplementation(mockPost);

          // To reset state
          store.dispatch(logout());

          // Test register
          await store.dispatch(
            passwordResetRequest({
              email: 'my@email.com'
            })
          );

          state = store.getState().auth;
        });

        it('sets errors', () => {
          expect(state.errors).toStrictEqual(['Request error occurred.']);
        });
      });
    });

    describe('when request is fired before finishing the initial request', () => {
      beforeEach(async () => {
        mockPost = jest.fn().mockImplementation(() => {
          return new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    status: 200,
                    data: {
                      result: true
                    }
                  }
                }),
              100
            )
          );
        });
        jest.spyOn(api, 'post').mockImplementation(mockPost);

        // To reset state
        store.dispatch(logout());

        await Promise.all([
          // Fire initial request
          store.dispatch(
            passwordResetRequest({
              email: 'my@email.com'
            })
          ),

          // Fire second request
          store.dispatch(
            passwordResetRequest({
              email: 'my@email.com'
            })
          )
        ]);

        state = store.getState().auth;
      });

      it('triggers api.post only once', () => {
        expect(api.post).toHaveBeenCalledTimes(1);
      });
    });
  });
});
