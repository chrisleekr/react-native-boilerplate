import React from 'react';
import * as redux from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  act
} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import store from '../../../store/store';

import SettingScreen from '../index';

let rendered;
let element;

const mockGoBack = jest.fn();

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <NavigationContainer>
        <SettingScreen navigation={{goBack: mockGoBack}} />
      </NavigationContainer>
    </redux.Provider>
  </ThemeProvider>
);

describe('SettingScreen', () => {
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

  describe('dark mode', () => {
    beforeEach(() => {
      element = rendered.getByTestId('dark-mode-switch');
    });
    describe('check current state', () => {
      it('sets switch as unchecked', () => {
        element = rendered.getByTestId('dark-mode-switch');

        expect(element.props.value).toBeFalsy();
      });
    });
    describe('toggle dark mode', () => {
      beforeEach(async () => {
        act(() => {
          fireEvent(element, 'onValueChange', true);
        });
      });

      it('matches snapshot', () => {
        expect(rendered.toJSON()).toMatchSnapshot();
      });

      it('sets switch as checked', () => {
        expect(element.props.value).toBeTruthy();
      });
    });

    describe('toggle light mode', () => {
      beforeEach(async () => {
        act(() => {
          fireEvent(element, 'onValueChange', false);
        });
      });

      it('matches snapshot', () => {
        expect(rendered.toJSON()).toMatchSnapshot();
      });

      it('sets switch as unchecked', () => {
        expect(element.props.value).toBeFalsy();
      });
    });
  });
});
