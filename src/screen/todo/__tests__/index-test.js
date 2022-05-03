import React from 'react';
import * as redux from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  act,
  within
} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import store from '../../../store/store';
import {login} from '../../../store/slice/authSlice';

import TodoScreen from '../index';

let rendered;

let mockLogin = Promise.resolve({
  status: 200,
  data: {
    data: {
      auth_key: 'auth-key',
      refresh_auth_key: 'refresh-auth-key'
    }
  }
});

jest.mock('../../../service/authService', () => ({
  login: () => mockLogin
}));

let mockList;
let mockPostOne;
let mockPatchOne;
let mockDeleteOne;

jest.mock('../../../service/todoService', () => ({
  list: () => mockList,
  postOne: () => mockPostOne,
  patchOne: () => mockPatchOne,
  deleteOne: () => mockDeleteOne
}));

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <NavigationContainer>
        <TodoScreen />
      </NavigationContainer>
    </redux.Provider>
  </ThemeProvider>
);

describe('TodoScreen', () => {
  afterEach(cleanup);

  beforeEach(() => {
    // Set default mock response data
    // Each test if required will update mock response data.
    mockList = Promise.resolve({
      success: true,
      status: 200,
      message: '',
      data: {
        rows: [
          {
            id: 1,
            name: '123456',
            state: 'ongoing'
          },
          {
            id: 2,
            name: '418484684',
            state: 'ongoing'
          },
          {
            id: 3,
            name: '4564564',
            state: 'ongoing'
          }
        ],
        pagination: {page: 1, page_size: 999999, total_rows: 3, first_row_no: 3}
      }
    });

    mockPostOne = Promise.resolve({
      success: true,
      status: 200,
      message: '',
      data: {result: true, id: 1}
    });

    mockPatchOne = Promise.resolve({
      success: true,
      status: 200,
      message: '',
      data: {result: true, id: 11}
    });

    mockDeleteOne = Promise.resolve({
      success: true,
      status: 200,
      message: '',
      data: {result: true, id: 11}
    });
  });

  describe('without login', () => {
    beforeEach(async () => {
      rendered = render(component);
      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('shows not logged in message', () => {
      expect(rendered.queryByTestId('todo-not-auth')).toBeTruthy();
    });

    it('does not show todo screen', () => {
      expect(rendered.queryByTestId('todo-screen')).toBeFalsy();
    });
  });

  describe('with login', () => {
    describe('without any list', () => {
      beforeEach(async () => {
        mockList = Promise.resolve({
          success: true,
          status: 200,
          message: '',
          data: {
            rows: [],
            pagination: {
              page: 1,
              page_size: 999999,
              total_rows: 0,
              first_row_no: 0
            }
          }
        });

        store.dispatch(
          login({username: 'my-username', password: 'my-password'})
        );

        rendered = render(component);
        await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
      });

      it('matches snapshot', () => {
        expect(rendered.toJSON()).toMatchSnapshot();
      });

      it('does not show not logged in message', () => {
        expect(rendered.queryByTestId('todo-not-auth')).toBeFalsy();
      });

      it('shows todo screen', () => {
        expect(rendered.queryByTestId('todo-screen')).toBeTruthy();
      });

      it('shows no list message', () => {
        expect(rendered.queryByTestId('no-list')).toBeTruthy();
      });
    });

    describe('with list', () => {
      beforeEach(async () => {
        mockList = Promise.resolve({
          success: true,
          status: 200,
          message: '',
          data: {
            rows: [
              {
                id: 1,
                name: '123456',
                state: 'ongoing'
              },
              {
                id: 2,
                name: '418484684',
                state: 'ongoing'
              },
              {
                id: 3,
                name: '4564564',
                state: 'completed'
              }
            ],
            pagination: {
              page: 1,
              page_size: 999999,
              total_rows: 3,
              first_row_no: 3
            }
          }
        });

        store.dispatch(
          login({username: 'my-username', password: 'my-password'})
        );

        rendered = render(component);
        await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
      });

      it('matches snapshot', () => {
        expect(rendered.toJSON()).toMatchSnapshot();
      });

      it('does not show not logged in message', () => {
        expect(rendered.queryByTestId('todo-not-auth')).toBeFalsy();
      });

      it('shows todo screen', () => {
        expect(rendered.queryByTestId('todo-screen')).toBeTruthy();
      });

      it('does not show no list message', () => {
        expect(rendered.queryByTestId('no-list')).toBeFalsy();
      });

      it('shows ongoing todo', () => {
        expect(rendered.queryByTestId('todo-ongoing-1')).toBeTruthy();
      });

      it('shows completed todo', () => {
        expect(rendered.queryByTestId('todo-completed-3')).toBeTruthy();
      });

      describe('ongoing todo card', () => {
        describe('update todo', () => {
          beforeEach(() => {
            // Mock the response after refreshing
            mockList = Promise.resolve({
              success: true,
              status: 200,
              message: '',
              data: {
                rows: [
                  {
                    id: 1,
                    name: '123456',
                    state: 'ongoing'
                  },
                  {
                    id: 2,
                    name: '418484684',
                    state: 'completed'
                  },
                  {
                    id: 3,
                    name: '4564564',
                    state: 'completed'
                  }
                ],
                pagination: {
                  page: 1,
                  page_size: 999999,
                  total_rows: 3,
                  first_row_no: 3
                }
              }
            });
          });
          describe('success', () => {
            beforeEach(async () => {
              mockPatchOne = Promise.resolve({
                success: true,
                status: 200,
                message: '',
                data: {result: true, id: 1}
              });

              fireEvent.press(
                within(rendered.getByTestId('todo-ongoing-2')).getByTestId(
                  'left-icon'
                )
              );

              await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
            });

            it('matches snapshot', () => {
              expect(rendered.toJSON()).toMatchSnapshot();
            });

            it('shows updated todo', () => {
              expect(rendered.queryByTestId('todo-completed-2')).toBeTruthy();
            });
          });

          describe('failed', () => {
            beforeEach(async () => {
              mockPatchOne = Promise.reject({
                response: {
                  status: 500,
                  data: {
                    data: [{msg: 'Error'}]
                  }
                }
              });

              fireEvent.press(
                within(rendered.getByTestId('todo-ongoing-1')).getByTestId(
                  'left-icon'
                )
              );

              await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
            });

            it('matches snapshot', () => {
              expect(rendered.toJSON()).toMatchSnapshot();
            });

            it('still shows same todo', () => {
              expect(rendered.queryByTestId('todo-ongoing-1')).toBeTruthy();
            });
          });
        });

        describe('remove todo', () => {
          beforeEach(() => {
            // Mock the response after refreshing
            mockList = Promise.resolve({
              success: true,
              status: 200,
              message: '',
              data: {
                rows: [
                  {
                    id: 1,
                    name: '123456',
                    state: 'ongoing'
                  },
                  {
                    id: 3,
                    name: '418484684',
                    state: 'completed'
                  }
                ],
                pagination: {
                  page: 1,
                  page_size: 999999,
                  total_rows: 3,
                  first_row_no: 3
                }
              }
            });
          });

          describe('success', () => {
            beforeEach(async () => {
              mockDeleteOne = Promise.resolve({
                success: true,
                status: 200,
                message: '',
                data: {result: true, id: 3}
              });

              fireEvent.press(
                within(rendered.getByTestId('todo-ongoing-2')).getByTestId(
                  'right-icon'
                )
              );

              await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
            });

            it('matches snapshot', () => {
              expect(rendered.toJSON()).toMatchSnapshot();
            });

            it('does not show removed todo', () => {
              expect(rendered.queryByTestId('todo-ongoing-2')).toBeFalsy();
            });
          });

          describe('failed', () => {
            beforeEach(async () => {
              mockDeleteOne = Promise.reject({
                response: {
                  status: 500,
                  data: {
                    data: [{msg: 'Error'}]
                  }
                }
              });

              fireEvent.press(
                within(rendered.getByTestId('todo-ongoing-2')).getByTestId(
                  'right-icon'
                )
              );

              await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
            });

            it('matches snapshot', () => {
              expect(rendered.toJSON()).toMatchSnapshot();
            });

            it('still shows same todo', () => {
              expect(rendered.queryByTestId('todo-ongoing-2')).toBeTruthy();
            });
          });
        });
      });

      describe('completed todo card', () => {
        describe('update todo', () => {
          beforeEach(() => {
            // Mock the response after refreshing
            mockList = Promise.resolve({
              success: true,
              status: 200,
              message: '',
              data: {
                rows: [
                  {
                    id: 1,
                    name: '123456',
                    state: 'ongoing'
                  },
                  {
                    id: 2,
                    name: '418484684',
                    state: 'completed'
                  },
                  {
                    id: 3,
                    name: '4564564',
                    state: 'ongoing'
                  }
                ],
                pagination: {
                  page: 1,
                  page_size: 999999,
                  total_rows: 3,
                  first_row_no: 3
                }
              }
            });
          });
          describe('success', () => {
            beforeEach(async () => {
              mockPatchOne = Promise.resolve({
                success: true,
                status: 200,
                message: '',
                data: {result: true, id: 1}
              });

              fireEvent.press(
                within(rendered.getByTestId('todo-completed-3')).getByTestId(
                  'left-icon'
                )
              );

              await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
            });

            it('matches snapshot', () => {
              expect(rendered.toJSON()).toMatchSnapshot();
            });

            it('shows updated todo', () => {
              expect(rendered.queryByTestId('todo-ongoing-3')).toBeTruthy();
            });
          });

          describe('failed', () => {
            beforeEach(async () => {
              mockPatchOne = Promise.reject({
                response: {
                  status: 500,
                  data: {
                    data: [{msg: 'Error'}]
                  }
                }
              });

              fireEvent.press(
                within(rendered.getByTestId('todo-completed-3')).getByTestId(
                  'left-icon'
                )
              );

              await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
            });

            it('matches snapshot', () => {
              expect(rendered.toJSON()).toMatchSnapshot();
            });

            it('still shows same todo', () => {
              expect(rendered.queryByTestId('todo-completed-3')).toBeTruthy();
            });
          });
        });

        describe('remove todo', () => {
          beforeEach(() => {
            // Mock the response after refreshing
            mockList = Promise.resolve({
              success: true,
              status: 200,
              message: '',
              data: {
                rows: [
                  {
                    id: 1,
                    name: '123456',
                    state: 'ongoing'
                  },
                  {
                    id: 2,
                    name: '456789',
                    state: 'ongoing'
                  }
                ],
                pagination: {
                  page: 1,
                  page_size: 999999,
                  total_rows: 3,
                  first_row_no: 3
                }
              }
            });
          });

          describe('success', () => {
            beforeEach(async () => {
              mockDeleteOne = Promise.resolve({
                success: true,
                status: 200,
                message: '',
                data: {result: true, id: 3}
              });

              fireEvent.press(
                within(rendered.getByTestId('todo-completed-3')).getByTestId(
                  'right-icon'
                )
              );

              await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
            });

            it('matches snapshot', () => {
              expect(rendered.toJSON()).toMatchSnapshot();
            });

            it('does not show removed todo', () => {
              expect(rendered.queryByTestId('todo-completed-3')).toBeFalsy();
            });
          });

          describe('failed', () => {
            beforeEach(async () => {
              mockDeleteOne = Promise.reject({
                response: {
                  status: 500,
                  data: {
                    data: [{msg: 'Error'}]
                  }
                }
              });

              fireEvent.press(
                within(rendered.getByTestId('todo-completed-3')).getByTestId(
                  'right-icon'
                )
              );

              await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
            });

            it('matches snapshot', () => {
              expect(rendered.toJSON()).toMatchSnapshot();
            });

            it('still shows same todo', () => {
              expect(rendered.queryByTestId('todo-completed-3')).toBeTruthy();
            });
          });
        });
      });

      describe('pull to refresh', () => {
        beforeEach(async () => {
          // Mock the response after refreshing
          mockList = Promise.resolve({
            success: true,
            status: 200,
            message: '',
            data: {
              rows: [
                {
                  id: 1,
                  name: '123456',
                  state: 'ongoing'
                },
                {
                  id: 2,
                  name: '418484684',
                  state: 'completed'
                },
                {
                  id: 3,
                  name: '4564564',
                  state: 'completed'
                }
              ],
              pagination: {
                page: 1,
                page_size: 999999,
                total_rows: 3,
                first_row_no: 3
              }
            }
          });

          const {refreshControl} = rendered.getByTestId('scroll-view').props;
          act(() => refreshControl.props.onRefresh());

          await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
        });

        it('matches snapshot', () => {
          expect(rendered.toJSON()).toMatchSnapshot();
        });

        it('shows updated todo', () => {
          expect(rendered.queryByTestId('todo-completed-2')).toBeTruthy();
        });
      });
    });
  });
});
