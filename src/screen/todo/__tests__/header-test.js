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

import TodoHeader from '../header';

let rendered;

let mockList = Promise.resolve({
  success: true,
  status: 200,
  message: '',
  data: {
    rows: [
      {
        id: 1,
        name: '123456',
        state: 'ongoing'
      }
    ],
    pagination: {page: 1, page_size: 999999, total_rows: 3, first_row_no: 3}
  }
});

let mockPostOne;

jest.mock('../../../service/todoService', () => ({
  list: () => mockList,
  postOne: () => mockPostOne
}));

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <NavigationContainer>
        <TodoHeader />
      </NavigationContainer>
    </redux.Provider>
  </ThemeProvider>
);

describe('TodoHeader', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    rendered = render(component);
    await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  describe('clicks register button without entering fields', () => {
    beforeEach(async () => {
      fireEvent.press(
        within(rendered.getByTestId('name-input')).getByTestId('icon')
      );
      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });

  describe('success', () => {
    it('enters todo', async () => {
      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('name-input')).getByTestId('input'),
          'Lee'
        );
      });

      fireEvent.press(
        within(rendered.getByTestId('name-input')).getByTestId('icon')
      );

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });
  });

  describe('fail', () => {
    it('enters todo', async () => {
      mockPostOne = Promise.reject({
        response: {
          status: 500,
          data: {
            data: [{msg: 'Error'}]
          }
        }
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('name-input')).getByTestId('input'),
          'Lee'
        );
      });

      fireEvent.press(
        within(rendered.getByTestId('name-input')).getByTestId('icon')
      );

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });
  });
});
