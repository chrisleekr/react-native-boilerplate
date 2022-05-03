import 'react-native';
import React from 'react';

import {cleanup, render} from '@testing-library/react-native';

import App from '../App';

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({
    isConnected: true
  })
}));

jest.mock('../src/navigation/main', () => props => (
  <main-navigation testID="main-navigation" {...props} />
));

jest.mock('../src/component/general/noInternet', () => props => (
  <no-internet-toast testID="no-internet-toast" {...props} />
));

let rendered;
describe('renders correctly', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(<App />);
  });

  it('matches snapshot', async () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders main navigation', () => {
    expect(rendered.queryByTestId('main-navigation')).toBeTruthy();
  });

  it('renders no internet toast', () => {
    expect(rendered.queryByTestId('no-internet-toast')).toBeTruthy();
  });
});
