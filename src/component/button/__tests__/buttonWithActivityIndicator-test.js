import 'react-native';
import React from 'react';

import {cleanup, render, fireEvent} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import ButtonWithActivityIndicator from '../buttonWithActivityIndicator';

let rendered;
let element;
let onPress;
let isLoading;
let disabled;

const renderComponment = () =>
  render(
    <ThemeProvider>
      <ButtonWithActivityIndicator
        onPress={onPress}
        buttonStyle={{
          fontSize: 13
        }}
        text={'My Text'}
        isLoading={isLoading}
        disabled={disabled}
      />
    </ThemeProvider>
  );

describe('ButtonWithActivityIndicator', () => {
  afterEach(cleanup);

  describe('no loading, no disabled', () => {
    beforeEach(() => {
      onPress = jest.fn();
      isLoading = false;
      disabled = false;

      rendered = renderComponment();
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    describe('checks disabled', () => {
      beforeEach(() => {
        element = rendered.getByTestId('button');
      });

      it('sets as active', () => {
        expect(element.props.accessibilityState.disabled).toBeFalsy();
      });
    });

    describe('activity indicator', () => {
      beforeEach(() => {
        element = rendered.queryByTestId('activity-indicator');
      });

      it('does not render activity indicator', () => {
        expect(element).toBeNull();
      });
    });

    describe('onPress', () => {
      beforeEach(() => {
        fireEvent.press(rendered.getByTestId('button'));
      });

      it('triggers onPress', () => {
        expect(onPress).toHaveBeenCalled();
      });
    });

    describe('text', () => {
      beforeEach(() => {
        element = rendered.getByText('My Text');
      });

      it('rendered text', () => {
        expect(element).toBeTruthy();
      });
    });
  });

  describe('isLoading', () => {
    beforeEach(() => {
      onPress = jest.fn();
      isLoading = true;
      disabled = false;

      rendered = renderComponment();
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    describe('checks disabled', () => {
      beforeEach(() => {
        element = rendered.getByTestId('button');
      });

      it('sets as disabled', () => {
        expect(element.props.accessibilityState.disabled).toBeTruthy();
      });
    });

    describe('shows activity indicator', () => {
      beforeEach(() => {
        element = rendered.getByTestId('activity-indicator');
      });

      it('rendered activity indicator', () => {
        expect(element).toBeTruthy();
      });
    });
  });

  describe('disabled', () => {
    beforeEach(() => {
      onPress = jest.fn();
      isLoading = false;
      disabled = true;

      rendered = renderComponment();
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    describe('checks disabled', () => {
      beforeEach(() => {
        element = rendered.getByTestId('button');
      });

      it('sets as disabled', () => {
        expect(element.props.accessibilityState.disabled).toBeTruthy();
      });
    });

    describe('does not show activity indicator', () => {
      beforeEach(() => {
        element = rendered.queryByTestId('activity-indicator');
      });

      it('does not render activity indicator', () => {
        expect(element).toBeFalsy();
      });
    });
  });
});
