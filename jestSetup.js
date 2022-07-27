// Mock for redux-persist to render children without showing loading component
jest.mock('redux-persist/integration/react', () => ({
  PersistGate: props => props.children
}));

// Mock for @react-native-async-storage/async-storage
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock for @react-navigation
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// To make route key unique
jest.mock('nanoid/non-secure', () => ({
  nanoid: () => 'routeUniqId'
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock for react-native-toast-message
jest.mock('react-native-toast-message', () => {
  const RealComponent = jest.requireActual('react-native-toast-message');
  const ReactInternal = require('react');
  class Toast extends ReactInternal.Component {
    static show = jest.fn();
    static hide = jest.fn();

    render() {
      return ReactInternal.createElement(
        'Toast',
        this.props,
        this.props.children
      );
    }
  }
  Toast.propTypes = RealComponent.propTypes;
  return Toast;
});

// Mock for redux-persist
jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((_config, reducers) => reducers)
  };
});

// Mock for react-native-safe-area-context
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

// in a test setup file, or your test itself
const FRAME_TIME = 10;

global.requestAnimationFrame = cb => {
  setTimeout(cb, FRAME_TIME);
};

// To make warning silent temporary for the lottieview
// https://github.com/lottie-react-native/lottie-react-native/issues/858
jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn());

// To use Jest > 27
global.__DEV__ = true;
