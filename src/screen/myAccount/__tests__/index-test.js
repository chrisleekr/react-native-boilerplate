import React from 'react';
import * as redux from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  cleanup,
  fireEvent,
  render,
  waitFor
} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import store from '../../../store/store';

import MyAccountScreen from '../index';

let rendered;

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

let mockMe = Promise.resolve({
  data: {
    username: 'chrislee',
    first_name: 'Chris',
    last_name: 'Lee',
    email: 'tester@chrislee.kr',
    role: 1,
    last_login_at: '2022-04-27 00:14:30',
    last_login_ip: '123.456.789.123'
  }
});

jest.mock('../../../service/userService', () => ({
  me: () => mockMe
}));

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <NavigationContainer>
        <MyAccountScreen
          navigation={{goBack: mockGoBack, navigate: mockNavigate}}
        />
      </NavigationContainer>
    </redux.Provider>
  </ThemeProvider>
);

describe('MyAccountScreen', () => {
  afterEach(cleanup);

  describe('initially shows loading', () => {
    beforeEach(async () => {
      rendered = render(component);
      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });

  describe('after loading', () => {
    describe('successful me', () => {
      beforeEach(async () => {
        rendered = render(component);
        await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
      });

      it('matches snapshot', async () => {
        expect(await rendered.toJSON()).toMatchSnapshot();
      });

      [
        {
          text: 'chrislee'
        },
        {
          text: 'Chris, Lee'
        },
        {
          text: 'tester@chrislee.kr'
        },
        {
          text: '2022-04-27 00:14:30 (123.456.789.123)'
        }
      ].forEach(t => {
        it(`shows ${t.text}`, () => {
          expect(rendered.queryByText(t.text)).toBeTruthy();
        });
      });

      describe('onPress', () => {
        beforeEach(() => {
          fireEvent.press(rendered.getByTestId('update-information-button'));
        });

        it('triggers navigate', () => {
          expect(mockNavigate).toHaveBeenCalledWith('Update My Account');
        });
      });
    });

    describe('failed me', () => {
      beforeEach(async () => {
        mockMe = Promise.reject({
          status: 500,
          response: {
            data: {}
          }
        });

        rendered = render(component);
        await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
      });

      it('matches snapshot', async () => {
        expect(await rendered.toJSON()).toMatchSnapshot();
      });
    });
  });
});
