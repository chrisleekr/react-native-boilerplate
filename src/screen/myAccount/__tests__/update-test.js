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
import {me} from '../../../store/slice/userSlice';

import MyAccountUpdateScreen from '../update';

let rendered;

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

const mockMe = Promise.resolve({
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
let mockUpdateMe = Promise.resolve({
  status: 200,
  data: {
    message: 'Updated'
  }
});

jest.mock('../../../service/userService', () => ({
  me: () => mockMe,
  updateMe: () => mockUpdateMe
}));

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <NavigationContainer>
        <MyAccountUpdateScreen
          navigation={{goBack: mockGoBack, navigate: mockNavigate}}
        />
      </NavigationContainer>
    </redux.Provider>
  </ThemeProvider>
);

describe('MyAccountUpdateScreen', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    store.dispatch(me());

    rendered = render(component);

    // Workaround to wait for animation finished
    await waitFor(() =>
      expect(
        within(rendered.getByTestId('first-name-input')).getByTestId('label')
          .props.style.top
      ).toBe(18)
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`shows username`, () => {
    expect(rendered.queryByText('chrislee')).toBeTruthy();
  });

  [
    {
      text: 'tester@chrislee.kr'
    },
    {
      text: 'Chris'
    },
    {
      text: 'Lee'
    }
  ].forEach(t => {
    it(`shows initial value - ${t.text}`, async () => {
      expect(rendered.queryByDisplayValue(t.text)).toBeTruthy();
    });
  });

  describe('goBack', () => {
    beforeEach(async () => {
      fireEvent.press(rendered.getByTestId('back-button'));
    });

    it('triggers mockGoBack', () => {
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('enters invalid values', () => {
    beforeEach(async () => {
      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('first-name-input')).getByTestId('input'),
          ''
        );
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('last-name-input')).getByTestId('input'),
          ''
        );
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('password-input')).getByTestId('input'),
          'short'
        );
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('email-address-input')).getByTestId(
            'input'
          ),
          'invalid-email'
        );
      });

      fireEvent.press(rendered.getByTestId('update-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    [
      {
        field: 'firstName',
        error: 'First name is required.'
      },
      {
        field: 'lastName',
        error: 'Last name is required.'
      },
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
          within(rendered.getByTestId('first-name-input')).getByTestId('input'),
          'John'
        );
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('last-name-input')).getByTestId('input'),
          'Doe'
        );
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('password-input')).getByTestId('input'),
          'mySecurePassword'
        );
      });

      act(() => {
        fireEvent.changeText(
          within(rendered.getByTestId('email-address-input')).getByTestId(
            'input'
          ),
          'my@john.doe'
        );
      });

      fireEvent.press(rendered.getByTestId('update-button'));

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('triggers navigate', () => {
      expect(mockNavigate).toHaveBeenCalledWith('My Account');
    });
  });

  describe('shows errors from request', () => {
    beforeEach(async () => {
      mockUpdateMe = Promise.reject({
        response: {
          status: 422,
          data: {
            data: [{msg: 'Your email is already in use.'}]
          }
        }
      });

      fireEvent.press(rendered.getByTestId('update-button'));

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
