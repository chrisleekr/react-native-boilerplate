import api from '../../../service/api';

import store from '../../store';

import {resetErrors, setState, me, updateMe} from '../userSlice';

let state;
let mockGet;
let mockPost;

describe('todoSlice', () => {
  describe('resetErrors', () => {
    beforeEach(() => {
      store.dispatch(setState({key: 'errors', value: ['some existing error']}));

      store.dispatch(resetErrors());

      state = store.getState().user;
    });

    it('sets errors', () => {
      expect(state.errors).toStrictEqual([]);
    });
  });

  const resetState = () => {
    // To reset state
    store.dispatch(setState({key: 'errors', value: []}));
    store.dispatch(setState({key: 'user', value: {}}));
  };

  describe('me', () => {
    describe('when fulfilled', () => {
      beforeEach(async () => {
        mockGet = jest.fn().mockResolvedValue({
          data: {
            status: 200,
            data: {
              id: 1,
              first_name: 'first-name',
              last_name: 'last-name'
            }
          }
        });
        jest.spyOn(api, 'get').mockImplementation(mockGet);

        resetState();

        await store.dispatch(me());

        state = store.getState().user;
      });

      it('triggers api.get', () => {
        expect(mockGet).toHaveBeenCalledWith('/me', {});
      });

      it('sets user', () => {
        expect(state.user).toStrictEqual({
          id: 1,
          first_name: 'first-name',
          last_name: 'last-name'
        });
      });
    });

    describe('when rejected', () => {
      describe('when there is a response', () => {
        beforeEach(async () => {
          // Set login to return correctly
          mockGet = jest.fn().mockRejectedValue({
            response: {
              status: 500,
              data: {
                data: 'some error from server'
              }
            }
          });
          jest.spyOn(api, 'get').mockImplementation(mockGet);

          resetState();

          await store.dispatch(me());

          state = store.getState().user;
        });

        it('triggers api.get', () => {
          expect(mockGet).toHaveBeenCalledWith('/me', {});
        });

        it('sets user', () => {
          expect(state.user).toStrictEqual({});
        });
      });

      describe('when there is no response', () => {
        beforeEach(async () => {
          mockGet = jest
            .fn()
            .mockRejectedValue(new Error('something happened'));
          jest.spyOn(api, 'get').mockImplementation(mockGet);

          resetState();

          await store.dispatch(me());

          state = store.getState().user;
        });

        it('triggers api.get', () => {
          expect(mockGet).toHaveBeenCalledWith('/me', {});
        });

        it('sets user', () => {
          expect(state.user).toStrictEqual({});
        });
      });
    });

    describe('when request is fired before finishing the initial request', () => {
      beforeEach(async () => {
        // Set login to return correctly
        mockGet = jest.fn().mockImplementation(() => {
          return new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    status: 200,
                    data: {
                      id: 1,
                      first_name: 'first-name',
                      last_name: 'last-name'
                    }
                  }
                }),
              100
            )
          );
        });
        jest.spyOn(api, 'get').mockImplementation(mockGet);

        resetState();

        await Promise.all([
          // Fire initial request
          store.dispatch(me()),

          // Fire second request
          store.dispatch(me())
        ]);

        state = store.getState().user;
      });

      it('triggers api.get only once', () => {
        expect(api.get).toHaveBeenCalledTimes(1);
      });

      it('sets user', () => {
        expect(state.user).toStrictEqual({
          id: 1,
          first_name: 'first-name',
          last_name: 'last-name'
        });
      });
    });
  });

  describe('updateMe', () => {
    describe('when fulfilled', () => {
      beforeEach(async () => {
        mockPost = jest.fn().mockResolvedValue({
          data: {
            status: 200,
            data: {
              result: true
            }
          }
        });
        jest.spyOn(api, 'post').mockImplementation(mockPost);

        resetState();

        await store.dispatch(
          updateMe({
            email: 'my@email.com',
            password: 'my-password',
            firstName: 'first-name',
            lastName: 'last-name'
          })
        );

        state = store.getState().user;
      });

      it('triggers api.post', () => {
        expect(mockPost).toHaveBeenCalledWith('/me', {
          email: 'my@email.com',
          password: 'my-password',
          first_name: 'first-name',
          last_name: 'last-name'
        });
      });
    });

    describe('when rejected', () => {
      describe('when there is a response', () => {
        beforeEach(async () => {
          // Set login to return correctly
          mockPost = jest.fn().mockRejectedValue({
            response: {
              status: 500,
              data: {
                data: 'some error from server'
              }
            }
          });
          jest.spyOn(api, 'post').mockImplementation(mockPost);

          resetState();

          await store.dispatch(
            updateMe({
              email: 'my@email.com',
              password: 'my-password',
              firstName: 'first-name',
              lastName: 'last-name'
            })
          );

          state = store.getState().user;
        });

        it('triggers api.post', () => {
          expect(mockPost).toHaveBeenCalledWith('/me', {
            email: 'my@email.com',
            password: 'my-password',
            first_name: 'first-name',
            last_name: 'last-name'
          });
        });
      });

      describe('when there is no response', () => {
        beforeEach(async () => {
          mockPost = jest
            .fn()
            .mockRejectedValue(new Error('something happened'));
          jest.spyOn(api, 'post').mockImplementation(mockPost);

          resetState();

          await store.dispatch(
            updateMe({
              email: 'my@email.com',
              password: 'my-password',
              firstName: 'first-name',
              lastName: 'last-name'
            })
          );

          state = store.getState().user;
        });

        it('triggers api.post', () => {
          expect(mockPost).toHaveBeenCalledWith('/me', {
            email: 'my@email.com',
            password: 'my-password',
            first_name: 'first-name',
            last_name: 'last-name'
          });
        });
      });
    });

    describe('when request is fired before finishing the initial request', () => {
      beforeEach(async () => {
        // Set login to return correctly
        mockPost = jest.fn().mockImplementation(() => {
          return new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    status: 200,
                    data: {
                      id: 1,
                      first_name: 'first-name',
                      last_name: 'last-name'
                    }
                  }
                }),
              100
            )
          );
        });
        jest.spyOn(api, 'post').mockImplementation(mockPost);

        resetState();

        await Promise.all([
          // Fire initial request
          store.dispatch(
            updateMe({
              email: 'my@email.com',
              password: 'my-password',
              firstName: 'first-name',
              lastName: 'last-name'
            })
          ),

          // Fire second request
          store.dispatch(
            updateMe({
              email: 'my@email.com',
              password: 'my-password',
              firstName: 'first-name',
              lastName: 'last-name'
            })
          )
        ]);

        state = store.getState().user;
      });

      it('triggers api.post only once', () => {
        expect(api.post).toHaveBeenCalledTimes(1);
      });
    });
  });
});
