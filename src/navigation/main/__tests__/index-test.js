import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as redux from 'react-redux';
import {
  cleanup,
  fireEvent,
  render,
  waitFor
} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ThemeProvider} from '../../../theme/useTheme';

import MainNavigation from '../index';

let rendered;
let state;
let mockInitialise = jest.fn();
let mockUseDispatch = jest.fn();

jest.mock('../../../store/slice/authSlice', () => ({
  initialise: jest.fn()
}));
import {initialise} from '../../../store/slice/authSlice';

const spyUseSelector = jest.spyOn(redux, 'useSelector');
const spyUseDispatch = jest.spyOn(redux, 'useDispatch');

jest.mock('../tab', () => props => (
  <tab-component testID="tab-component" {...props} />
));

jest.mock('../../../component/onboardingScreen', () => props => (
  <onboarding-screen testID="onboarding-screen" {...props} />
));
jest.mock('../../../screen/login', () => props => (
  <login-screen testID="login-screen" {...props} />
));
jest.mock('../../../screen/register', () => props => (
  <register-screen testID="register-screen" {...props} />
));
jest.mock('../../../screen/register/success', () => props => (
  <register-success-screen testID="register-success-screen" {...props} />
));
jest.mock('../../../screen/myAccount', () => props => (
  <my-account-screen testID="my-account-screen" {...props} />
));
jest.mock('../../../screen/logout', () => props => (
  <logout-screen testID="logout-screen" {...props} />
));
jest.mock('../../../screen/forgotPassword', () => props => (
  <forgot-password-screen testID="forgot-password-screen" {...props} />
));
jest.mock('../../../screen/forgotPassword/success', () => props => (
  <forgot-password-success-screen
    testID="forgot-password-success-screen"
    {...props}
  />
));
jest.mock('../../../screen/myAccount/update', () => props => (
  <my-account-update-screen testID="my-account-update-screen" {...props} />
));
jest.mock('../../../screen/setting', () => props => (
  <setting-screen testID="setting-screen" {...props} />
));

const component = (
  <GestureHandlerRootView>
    <SafeAreaProvider>
      <ThemeProvider>
        <MainNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

describe('MainNavigation', () => {
  afterEach(cleanup);

  beforeEach(() => {
    initialise.mockImplementation(mockInitialise);

    state = {
      auth: {
        isAuthenticated: false
      }
    };
    spyUseSelector.mockImplementation(cb => cb(state));
    spyUseDispatch.mockReturnValue(mockUseDispatch);

    AsyncStorage.setItem = jest.fn();
  });

  describe('when first launch', () => {
    beforeEach(async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValue(null);

      rendered = render(component);

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('matches snapshot', async () => {
      expect(await rendered.toJSON()).toMatchSnapshot();
    });

    it('does not render loading', () => {
      expect(rendered.queryByTestId('loading')).toBeFalsy();
    });

    it('renders onboarding screen', () => {
      expect(rendered.queryByTestId('onboarding-screen')).toBeTruthy();
    });

    it('does not render tab component', () => {
      expect(rendered.queryByTestId('tab-component')).toBeFalsy();
    });

    it('triggers AsyncStorage.getItem', () => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('alreadyLaunched');
    });

    it('triggers AsyncStorage.setItem', () => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'alreadyLaunched',
        'true'
      );
    });

    it('dispaches initialise', () => {
      expect(mockUseDispatch).toHaveBeenCalledWith(mockInitialise());
    });
  });

  describe('when it is not first launch', () => {
    beforeEach(async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValue('true');

      rendered = render(component);

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    it('matches snapshot', async () => {
      expect(await rendered.toJSON()).toMatchSnapshot();
    });

    it('does not render loading', () => {
      expect(rendered.queryByTestId('loading')).toBeFalsy();
    });

    it('does not render onboarding screen', () => {
      expect(rendered.queryByTestId('onboarding-screen')).toBeFalsy();
    });

    it('renders tab component', () => {
      expect(rendered.queryByTestId('tab-component')).toBeTruthy();
    });

    it('does not trigger AsyncStorage.setItem', () => {
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('dispaches initialise', () => {
      expect(mockUseDispatch).toHaveBeenCalledWith(mockInitialise());
    });
  });

  describe('is not authenticated', () => {
    beforeEach(async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValue('true');

      rendered = render(component);

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    [
      {
        name: 'Login',
        component: 'login-screen'
      },
      {
        name: 'Register',
        component: 'register-screen'
      },
      {
        name: 'Register Success',
        component: 'register-success-screen'
      },
      {
        name: 'Forgot Password',
        component: 'forgot-password-screen'
      },
      {
        name: 'Forgot Password Success',
        component: 'forgot-password-success-screen'
      },
      {
        name: 'Settings',
        component: 'setting-screen'
      }
    ].forEach(t => {
      it(`shows ${t.name} menu`, () => {
        expect(rendered.getByText(t.name)).toBeTruthy();
      });

      describe(`tests ${t.name} screen`, () => {
        beforeEach(async () => {
          fireEvent(await rendered.findByText(t.name), 'press');
        });

        it(`matches snapshot for ${t.name} screen`, async () => {
          expect(await rendered.toJSON()).toMatchSnapshot();
        });

        it(`shows ${t.name} screen`, async () => {
          await waitFor(() =>
            expect(rendered.queryByTestId(t.component)).toBeTruthy()
          );
        });
      });
    });

    [
      {
        name: 'My Account'
      },
      {
        name: 'Update My Account'
      },
      {
        name: 'Logout'
      }
    ].forEach(t => {
      it(`does not show ${t.name} menu`, () => {
        expect(rendered.queryByTestId(t.name)).toBeFalsy();
      });
    });
  });

  describe('is authenticated', () => {
    beforeEach(async () => {
      AsyncStorage.getItem = jest.fn().mockResolvedValue('true');

      state = {
        auth: {
          isAuthenticated: true
        }
      };
      initialise.mockImplementation(mockInitialise);

      rendered = render(component);

      await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
    });

    [
      {
        name: 'My Account',
        component: 'my-account-screen'
      },
      {
        name: 'Update My Account',
        component: 'my-account-update-screen'
      },
      {
        name: 'Logout',
        component: 'logout-screen'
      }
    ].forEach(t => {
      it(`shows ${t.name} menu`, () => {
        expect(rendered.getByText(t.name)).toBeTruthy();
      });

      describe(`tests ${t.name} screen`, () => {
        beforeEach(async () => {
          fireEvent(await rendered.findByText(t.name), 'press');
        });

        it(`matches snapshot for ${t.name} screen`, async () => {
          expect(await rendered.toJSON()).toMatchSnapshot();
        });

        it(`shows ${t.name} screen`, async () => {
          await waitFor(() =>
            expect(rendered.queryByTestId(t.component)).toBeTruthy()
          );
        });
      });
    });

    [
      {
        name: 'Login'
      },
      {
        name: 'Register'
      },
      {
        name: 'Register Success'
      },
      {
        name: 'Forgot Password'
      },
      {
        name: 'Forgot Password Success'
      }
    ].forEach(t => {
      it(`does not show ${t.name} menu`, () => {
        expect(rendered.queryByTestId(t.name)).toBeFalsy();
      });
    });
  });
});
