import api from '../../../service/api';

import store from '../../store';

import {
  resetErrors,
  setState,
  list,
  addOne,
  updateOne,
  deleteOne
} from '../todoSlice';

let state;
let mockGet;
let mockPost;
let mockPatch;
let mockDelete;

describe('todoSlice', () => {
  describe('resetErrors', () => {
    beforeEach(() => {
      store.dispatch(setState({key: 'errors', value: ['some existing error']}));

      store.dispatch(resetErrors());

      state = store.getState().todo;
    });

    it('sets errors', () => {
      expect(state.errors).toStrictEqual([]);
    });
  });

  const resetState = () => {
    // To reset state
    store.dispatch(setState({key: 'errors', value: []}));
    store.dispatch(setState({key: 'todoOngoing', value: []}));
    store.dispatch(setState({key: 'todoCompleted', value: []}));
  };

  describe('list', () => {
    describe('when fulfilled', () => {
      beforeEach(async () => {
        mockGet = jest.fn().mockResolvedValue({
          data: {
            status: 200,
            data: {
              rows: [
                {
                  id: 1,
                  name: 'todo 1',
                  state: 'ongoing'
                },
                {
                  id: 2,
                  name: 'todo 2',
                  state: 'ongoing'
                },
                {
                  id: 3,
                  name: 'todo 3',
                  state: 'completed'
                },
                {
                  id: 4,
                  name: 'todo 4',
                  state: 'completed'
                }
              ]
            }
          }
        });
        jest.spyOn(api, 'get').mockImplementation(mockGet);

        resetState();

        await store.dispatch(list());

        state = store.getState().todo;
      });

      it('triggers api.get', () => {
        expect(mockGet).toHaveBeenCalledWith('/todo', {
          order_by: 'updated_at_desc'
        });
      });

      it('sets todoOngoing', () => {
        expect(state.todoOngoing).toStrictEqual([
          {
            id: 1,
            name: 'todo 1',
            state: 'ongoing'
          },
          {
            id: 2,
            name: 'todo 2',
            state: 'ongoing'
          }
        ]);
      });

      it('sets todoCompleted', () => {
        expect(state.todoCompleted).toStrictEqual([
          {
            id: 3,
            name: 'todo 3',
            state: 'completed'
          },
          {
            id: 4,
            name: 'todo 4',
            state: 'completed'
          }
        ]);
      });
    });

    describe('when rejected', () => {
      describe('when there is a response', () => {
        beforeEach(async () => {
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

          await store.dispatch(list());

          state = store.getState().todo;
        });

        it('triggers api.get', () => {
          expect(mockGet).toHaveBeenCalledWith('/todo', {
            order_by: 'updated_at_desc'
          });
        });

        it('sets todoOngoing', () => {
          expect(state.todoOngoing).toStrictEqual([]);
        });

        it('sets todoCompleted', () => {
          expect(state.todoCompleted).toStrictEqual([]);
        });
      });

      describe('when there is no response', () => {
        beforeEach(async () => {
          mockGet = jest
            .fn()
            .mockRejectedValue(new Error('something happened'));
          jest.spyOn(api, 'get').mockImplementation(mockGet);

          resetState();

          await store.dispatch(list());

          state = store.getState().todo;
        });

        it('triggers api.get', () => {
          expect(mockGet).toHaveBeenCalledWith('/todo', {
            order_by: 'updated_at_desc'
          });
        });

        it('sets todoOngoing', () => {
          expect(state.todoOngoing).toStrictEqual([]);
        });

        it('sets todoCompleted', () => {
          expect(state.todoCompleted).toStrictEqual([]);
        });
      });
    });

    describe('when request is fired before finishing the initial request', () => {
      beforeEach(async () => {
        mockGet = jest.fn().mockImplementation(() => {
          return new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    status: 200,
                    data: {
                      rows: [
                        {
                          id: 1,
                          name: 'todo 1',
                          state: 'ongoing'
                        }
                      ]
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
          store.dispatch(list()),

          // Fire second request
          store.dispatch(list())
        ]);

        state = store.getState().todo;
      });

      it('triggers api.get only once', () => {
        expect(api.get).toHaveBeenCalledTimes(1);
      });

      it('sets todoOngoing', () => {
        expect(state.todoOngoing).toStrictEqual([
          {
            id: 1,
            name: 'todo 1',
            state: 'ongoing'
          }
        ]);
      });

      it('sets todoCompleted', () => {
        expect(state.todoCompleted).toStrictEqual([]);
      });
    });
  });

  [
    {
      reducer: 'addOne',
      method: 'post',
      dispatch: addOne({name: 'my-todo', note: '', state: 'ongoing'}),
      expectedArg1: '/todo',
      expectedArg2: {
        name: 'my-todo',
        note: '',
        state: 'ongoing'
      }
    },
    {
      reducer: 'updateOne',
      method: 'patch',
      dispatch: updateOne({
        todo: {id: 1, name: 'my-todo', note: '', state: 'completed'}
      }),
      expectedArg1: '/todo/1',
      expectedArg2: {
        name: 'my-todo',
        note: '',
        state: 'completed'
      }
    },
    {
      reducer: 'deleteOne',
      method: 'delete',
      dispatch: deleteOne({
        todo: {id: 2}
      }),
      expectedArg1: '/todo/2',
      expectedArg2: undefined
    }
  ].forEach(t => {
    describe(`${t.reducer}`, () => {
      let mockMethod;
      beforeEach(() => {
        if (t.method === 'post') {
          mockMethod = mockPost;
        } else if (t.method === 'patch') {
          mockMethod = mockPatch;
        } else if (t.method === 'delete') {
          mockMethod = mockDelete;
        }
      });

      describe('when fulfilled', () => {
        beforeEach(async () => {
          mockMethod = jest.fn().mockResolvedValue({
            data: {
              status: 200,
              data: {
                result: true
              }
            }
          });
          jest.spyOn(api, t.method).mockImplementation(mockMethod);

          resetState();

          await store.dispatch(t.dispatch);

          state = store.getState().todo;
        });

        it(`triggers api.${t.method}`, () => {
          if (t.expectedArg2) {
            expect(mockMethod).toHaveBeenCalledWith(
              t.expectedArg1,
              t.expectedArg2
            );
          } else {
            expect(mockMethod).toHaveBeenCalledWith(t.expectedArg1);
          }
        });
      });

      describe('when rejected', () => {
        describe('when there is a response', () => {
          beforeEach(async () => {
            mockMethod = jest.fn().mockRejectedValue({
              response: {
                status: 500,
                data: {
                  data: 'some error from server'
                }
              }
            });
            jest.spyOn(api, t.method).mockImplementation(mockMethod);

            resetState();

            await store.dispatch(t.dispatch);

            state = store.getState().todo;
          });

          it(`triggers api.${t.method}`, () => {
            if (t.expectedArg2) {
              expect(mockMethod).toHaveBeenCalledWith(
                t.expectedArg1,
                t.expectedArg2
              );
            } else {
              expect(mockMethod).toHaveBeenCalledWith(t.expectedArg1);
            }
          });
        });

        describe('when there is no response', () => {
          beforeEach(async () => {
            mockMethod = jest
              .fn()
              .mockRejectedValue(new Error('something happened'));
            jest.spyOn(api, t.method).mockImplementation(mockMethod);

            resetState();

            await store.dispatch(t.dispatch);

            state = store.getState().todo;
          });

          it(`triggers api.${t.method}`, () => {
            if (t.expectedArg2) {
              expect(mockMethod).toHaveBeenCalledWith(
                t.expectedArg1,
                t.expectedArg2
              );
            } else {
              expect(mockMethod).toHaveBeenCalledWith(t.expectedArg1);
            }
          });
        });
      });

      describe('when request is fired before finishing the initial request', () => {
        beforeEach(async () => {
          mockMethod = jest.fn().mockImplementation(() => {
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
          jest.spyOn(api, t.method).mockImplementation(mockMethod);

          resetState();

          await Promise.all([
            // Fire initial request
            store.dispatch(t.dispatch),

            // Fire second request
            store.dispatch(t.dispatch)
          ]);

          state = store.getState().todo;
        });

        it(`triggers api.${t.method} only once`, () => {
          expect(mockMethod).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
