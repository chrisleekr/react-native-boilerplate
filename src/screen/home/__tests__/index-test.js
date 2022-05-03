import React from 'react';
import * as redux from 'react-redux';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import HomeScreen from '../index';

let rendered;
let state;

const spyUseSelector = jest.spyOn(redux, 'useSelector');

describe('HomeScreen', () => {
  afterEach(cleanup);

  describe('is not authenticated', () => {
    beforeEach(() => {
      state = {
        auth: {
          isAuthenticated: false
        }
      };

      spyUseSelector.mockImplementation(cb => cb(state));
      rendered = render(
        <ThemeProvider>
          <HomeScreen />
        </ThemeProvider>
      );
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('renders home with not authenticated state', () => {
      expect(rendered.queryByTestId('home-not-auth')).toBeTruthy();
    });

    it('renders logo', () => {
      expect(rendered.queryByTestId('logo')).toBeTruthy();
    });

    it('renders title', () => {
      expect(rendered.queryByTestId('title')).toBeTruthy();
    });

    it('renders content', () => {
      expect(rendered.queryByTestId('content')).toBeTruthy();
    });
  });

  describe('is  authenticated', () => {
    beforeEach(() => {
      state = {
        auth: {
          isAuthenticated: true
        }
      };

      spyUseSelector.mockImplementation(cb => cb(state));
      rendered = render(
        <ThemeProvider>
          <HomeScreen />
        </ThemeProvider>
      );
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('renders home with not authenticated state', () => {
      expect(rendered.queryByTestId('home-authed')).toBeTruthy();
    });

    it('renders logo', () => {
      expect(rendered.queryByTestId('logo')).toBeTruthy();
    });

    it('renders title', () => {
      expect(rendered.queryByTestId('title')).toBeTruthy();
    });

    it('renders content', () => {
      expect(rendered.queryByTestId('content')).toBeTruthy();
    });
  });
});
