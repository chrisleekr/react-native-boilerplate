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

import RegisterScreen from '../index';

let rendered;

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

let mockRegister = Promise.resolve({
  status: 200,
  data: {
    message: 'Updated'
  }
});

jest.mock('../../../service/authService', () => ({
  register: () => mockRegister
}));

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <NavigationContainer>
        <RegisterScreen
          navigation={{goBack: mockGoBack, navigate: mockNavigate}}
        />
      </NavigationContainer>
    </redux.Provider>
  </ThemeProvider>
);

describe('RegisterScreen', () => {
  afterEach(cleanup);

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

  describe('clicks register button without entering fields', () => {
    beforeEach(async () => {
      fireEvent.press(rendered.getByTestId('register-button'));
      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('does not trigger navigate', () => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    [
      {
        field: 'email',
        error: 'Email address is required.'
      },
      {
        field: 'username',
        error: 'Username is required.'
      },
      {
        field: 'password',
        error: 'Password is required.'
      },
      {
        field: 'firstName',
        error: 'First name is required.'
      },
      {
        field: 'lastName',
        error: 'Last name is required.'
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

      fireEvent.press(rendered.getByTestId('register-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('does not trigger navigate', () => {
      expect(mockNavigate).not.toHaveBeenCalled();
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

  const fillForm = () => {
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
        within(rendered.getByTestId('username-input')).getByTestId('input'),
        'chrislee'
      );
    });

    act(() => {
      fireEvent.changeText(
        within(rendered.getByTestId('password-input')).getByTestId('input'),
        'myPassword'
      );
    });

    act(() => {
      fireEvent.changeText(
        within(rendered.getByTestId('first-name-input')).getByTestId('input'),
        'Chris'
      );
    });

    act(() => {
      fireEvent.changeText(
        within(rendered.getByTestId('last-name-input')).getByTestId('input'),
        'Lee'
      );
    });
  };

  describe('enters valid values', () => {
    beforeEach(async () => {
      fillForm();

      fireEvent.press(rendered.getByTestId('register-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('triggers navigate', () => {
      expect(mockNavigate).toHaveBeenCalledWith('Register Success');
    });

    it('does not render errors', () => {
      expect(rendered.queryByTestId('errors')).toBeFalsy();
    });
  });

  describe('shows errors from request', () => {
    beforeEach(async () => {
      fillForm();

      mockRegister = Promise.reject({
        response: {
          status: 422,
          data: {
            data: [{msg: 'Your email is already in use.'}]
          }
        }
      });

      fireEvent.press(rendered.getByTestId('register-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('shows error message', async () => {
      await waitFor(() => {
        expect(
          rendered.queryByText('Your email is already in use.')
        ).toBeTruthy();
      });
    });

    it('does not trigger navigate', () => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
