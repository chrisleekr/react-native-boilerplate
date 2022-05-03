import 'react-native';
import React from 'react';

import {cleanup, render} from '@testing-library/react-native';

let mockIsConnected = true;

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({
    isConnected: mockIsConnected
  })
}));

import NoInternetToast from '../toast';

let rendered;

describe('NoInternetToast', () => {
  afterEach(cleanup);

  describe('when connected', () => {
    beforeEach(() => {
      mockIsConnected = true;
      rendered = render(<NoInternetToast />);
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('does not show error message', () => {
      expect(rendered.queryByTestId('text')).toBeFalsy();
    });
  });

  describe('when is not connected', () => {
    beforeEach(() => {
      mockIsConnected = false;
      rendered = render(<NoInternetToast />);
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('shows error message', () => {
      expect(rendered.queryByTestId('text')).toBeTruthy();
    });
  });
});
