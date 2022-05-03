import React from 'react';
import * as redux from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
  act
} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import store from '../../../store/store';

import LoginScreen from '../index';

let rendered;
let state;

let spyUseSelector;
let spyUseDispatch;

const mockGoBack = jest.fn();
const mockJumpTo = jest.fn();
const mockLogin = jest.fn();
const mockUseDispatch = jest.fn();

import * as authSlice from '../../../store/slice/authSlice';
const spyLogin = jest.spyOn(authSlice, 'login');

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <NavigationContainer>
        <LoginScreen navigation={{goBack: mockGoBack, jumpTo: mockJumpTo}} />
      </NavigationContainer>
    </redux.Provider>
  </ThemeProvider>
);

describe('LoginScreen', () => {
  afterEach(cleanup);

  beforeEach(() => {
    spyLogin.mockImplementation(mockLogin);
  });

  beforeEach(async () => {
    rendered = render(component);

    await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  describe('goBack', () => {
    beforeEach(async () => {
      fireEvent.press(rendered.getByTestId('back-button'));
    });

    it('triggers mockGoBack', () => {
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('click forgot password button', () => {
    beforeEach(async () => {
      fireEvent.press(rendered.getByTestId('forgot-password-button'));
    });

    it('triggers navigation.jumpTo', () => {
      expect(mockJumpTo).toHaveBeenCalledWith('Forgot Password');
    });
  });

  describe('click register button', () => {
    beforeEach(async () => {
      fireEvent.press(rendered.getByTestId('signup-button'));
    });

    it('triggers navigation.jumpTo', () => {
      expect(mockJumpTo).toHaveBeenCalledWith('Register');
    });
  });

  describe('clicks login button without entering fields', () => {
    beforeEach(async () => {
      fireEvent.press(rendered.getByTestId('login-button'));
      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('does not trigger login', () => {
      expect(mockLogin).not.toHaveBeenCalled();
    });

    [
      {
        field: 'username',
        error: 'Email address is required.'
      },
      {
        field: 'password',
        error: 'Password is required.'
      }
    ].forEach(t => {
      it(`shows error message for ${t.field}`, async () => {
        await waitFor(() => {
          expect(rendered.queryByText(t.error)).toBeTruthy();
        });
      });
    });
  });

  describe('enters invalid values', () => {
    beforeEach(async () => {
      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('email-address-input')).getByTestId(
            'input'
          ),
          'invalid-email'
        );
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('password-input')).getByTestId('input'),
          'short'
        );
      });

      fireEvent.press(rendered.getByTestId('login-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('does not trigger login', () => {
      expect(mockLogin).not.toHaveBeenCalled();
    });

    [
      {
        field: 'username',
        error: 'Please enter valid email.'
      },
      {
        field: 'password',
        error: 'Password must be at least 6 characters.'
      }
    ].forEach(t => {
      it(`shows error message for ${t.field}`, async () => {
        await waitFor(() => {
          expect(rendered.queryByText(t.error)).toBeTruthy();
        });
      });
    });
  });

  describe('enters valid values', () => {
    beforeEach(async () => {
      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('email-address-input')).getByTestId(
            'input'
          ),
          'tester@chrislee.kr'
        );
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('password-input')).getByTestId('input'),
          'myPassword'
        );
      });

      fireEvent.press(rendered.getByTestId('login-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('triggers login', () => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'tester@chrislee.kr',
        password: 'myPassword'
      });
    });

    it('does not render errors', () => {
      expect(rendered.queryByTestId('errors')).toBeFalsy();
    });
  });

  describe('shows errors from slice', () => {
    beforeEach(async () => {
      spyUseSelector = jest.spyOn(redux, 'useSelector');
      spyUseDispatch = jest.spyOn(redux, 'useDispatch');
      state = {
        auth: {
          loading: false,
          errors: ['Custom error']
        }
      };
      spyUseSelector.mockImplementation(cb => cb(state));
      spyUseDispatch.mockReturnValue(mockUseDispatch);

      rendered = render(component);

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });
});
