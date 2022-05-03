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

import ForgotPasswordScreen from '../index';

let rendered;

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

let mockPasswordResetRequest = Promise.resolve({
  status: 200,
  data: {
    message: 'Requested'
  }
});

jest.mock('../../../service/authService', () => ({
  passwordResetRequest: () => mockPasswordResetRequest
}));

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <NavigationContainer>
        <ForgotPasswordScreen
          navigation={{goBack: mockGoBack, navigate: mockNavigate}}
        />
      </NavigationContainer>
    </redux.Provider>
  </ThemeProvider>
);

describe('ForgotPasswordScreen', () => {
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

  describe('clicks reset button without entering fields', () => {
    beforeEach(async () => {
      fireEvent.press(rendered.getByTestId('reset-button'));
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

      fireEvent.press(rendered.getByTestId('reset-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('does not trigger navigate', () => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    [
      {
        field: 'email',
        error: 'Please enter valid email.'
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
  };

  describe('enters valid values', () => {
    beforeEach(async () => {
      fillForm();

      fireEvent.press(rendered.getByTestId('reset-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('triggers navigate', () => {
      expect(mockNavigate).toHaveBeenCalledWith('Forgot Password Success');
    });

    it('does not render errors', () => {
      expect(rendered.queryByTestId('errors')).toBeFalsy();
    });
  });

  describe('shows errors from request', () => {
    beforeEach(async () => {
      fillForm();

      mockPasswordResetRequest = Promise.reject({
        response: {
          status: 422,
          data: {
            data: [{msg: 'Your email is already in use.'}]
          }
        }
      });

      fireEvent.press(rendered.getByTestId('reset-button'));

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
