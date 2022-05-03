import 'react-native';
import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  within
} from '@testing-library/react-native';

import timeTravel, {setupTimeTravel} from '../../../util/timeTravel';
import {ThemeProvider} from '../../../theme/useTheme';

import TextInput from '../textInput';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));
import {useState} from 'react';

let rendered;
let component;
let element;

const onBlur = jest.fn();
const onChangeEmail = jest.fn();
const setFieldTouched = jest.fn();
const mockSetState = jest.fn();

describe('TextInput', () => {
  afterEach(cleanup);
  beforeEach(setupTimeTravel);

  beforeEach(() => {
    useState.mockImplementation(init => [init, mockSetState]);

    rendered = render(
      <ThemeProvider>
        <TextInput
          label={'My Label'}
          textInputStyle={{
            fontSize: 15
          }}
          field={{
            name: 'email-address',
            onBlur,
            onChange: jest.fn().mockImplementation(name => {
              switch (name) {
                case 'email-address':
                  return onChangeEmail;
              }
            }),
            value: 'Initial text'
          }}
          form={{
            errors: {},
            touched: {},
            setFieldTouched
          }}
          keyboardType="email-address"
        />
      </ThemeProvider>
    );

    component = rendered.getByTestId('text-input');
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('does not show errors', () => {
    expect(within(component).queryByTestId('errors')).toBeNull();
  });

  describe('onChangeText', () => {
    beforeEach(() => {
      element = within(component).getByTestId('input');

      fireEvent(element, 'onChangeText', 'New Text');
    });

    it('should trigger onChangeEmail', () => {
      expect(onChangeEmail).toHaveBeenCalledWith('New Text');
    });
  });

  describe('onFocus', () => {
    beforeEach(() => {
      element = within(component).getByTestId('input');

      fireEvent(element, 'onFocus');
    });

    it('should set state for isFocused', () => {
      expect(mockSetState).toHaveBeenCalledWith(true);
    });
  });

  describe('onBlur', () => {
    beforeEach(() => {
      element = within(component).getByTestId('input');
      fireEvent(element, 'onBlur');
    });

    it('should set mockSetState as false', () => {
      expect(mockSetState).toHaveBeenCalledWith(false);
    });

    it('should trigger setFieldTouched', () => {
      expect(setFieldTouched).toHaveBeenCalledWith('email-address');
    });

    it('should trigger onBlur', () => {
      expect(onBlur).toHaveBeenCalledWith('email-address');
    });
  });

  describe('error text', () => {
    beforeEach(() => {
      rendered = render(
        <ThemeProvider>
          <TextInput
            label={'My Label'}
            textInputStyle={{
              fontSize: 15
            }}
            field={{
              name: 'email-address',
              onBlur,
              onChange: jest.fn().mockImplementation(name => {
                switch (name) {
                  case 'email-address':
                    return onChangeEmail;
                }
              }),
              value: 'Initial text'
            }}
            form={{
              errors: {
                'email-address': 'Please enter a valid email address.'
              },
              touched: {
                'email-address': true
              },
              setFieldTouched
            }}
            keyboardType="email-address"
          />
        </ThemeProvider>
      );

      component = rendered.getByTestId('text-input');
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('shows errors', () => {
      expect(within(component).queryByTestId('errors')).toBeTruthy();
    });
  });

  describe('Animated.timing', () => {
    beforeEach(() => {
      // Use actual useState
      useState.mockImplementation(jest.requireActual('react').useState);

      rendered = render(
        <ThemeProvider>
          <TextInput
            label={'My Label'}
            textInputStyle={{
              fontSize: 15
            }}
            field={{
              name: 'email-address',
              onBlur,
              onChange: jest.fn().mockImplementation(name => {
                switch (name) {
                  case 'email-address':
                    return onChangeEmail;
                }
              }),
              value: ''
            }}
            form={{
              errors: {
                'email-address': 'Please enter a valid email address.'
              },
              touched: {
                'email-address': true
              },
              setFieldTouched
            }}
            keyboardType="email-address"
          />
        </ThemeProvider>
      );

      component = rendered.getByTestId('text-input');
      element = within(component).getByTestId('input');
      fireEvent(element, 'onFocus');
      timeTravel(200);
      fireEvent(element, 'onBlur');
      timeTravel(200);
    });

    it('shows animated label', () => {
      expect(within(component).queryByTestId('label')).toBeTruthy();
    });
  });
});
