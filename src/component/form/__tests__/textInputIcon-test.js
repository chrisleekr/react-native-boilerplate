import 'react-native';
import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  within
} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import TextInputIcon from '../textInputIcon';

let rendered;
let component;
let element;

const onPressIcon = jest.fn();
const onBlur = jest.fn();
const onChangeTodo = jest.fn();
const setFieldTouched = jest.fn();

describe('TextInputIcon', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <TextInputIcon
          label={'My Label'}
          containerStyle={{
            backgroundColor: '#000000'
          }}
          textInputStyle={{
            fontSize: 15
          }}
          iconName="plus"
          iconSize={15}
          iconStyle={{
            marginLeft: 10
          }}
          onPressIcon={onPressIcon}
          isLoading={false}
          field={{
            name: 'todo',
            onBlur,
            onChange: jest.fn().mockImplementation(name => {
              switch (name) {
                case 'todo':
                  return onChangeTodo;
              }
            }),
            value: 'Initial text'
          }}
          form={{
            errors: {},
            touched: {},
            setFieldTouched
          }}
          keyboardType="number-pad"
        />
      </ThemeProvider>
    );

    component = rendered.getByTestId('text-input-icon');
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  describe('onChangeText', () => {
    beforeEach(() => {
      element = within(component).getByTestId('input');

      fireEvent(element, 'onChangeText', 'New Text');
    });

    it('should trigger onChangeTodo', () => {
      expect(onChangeTodo).toHaveBeenCalledWith('New Text');
    });
  });

  describe('onBlur', () => {
    beforeEach(() => {
      element = within(component).getByTestId('input');

      fireEvent(element, 'onBlur');
    });

    it('should trigger setFieldTouched', () => {
      expect(setFieldTouched).toHaveBeenCalledWith('todo');
    });

    it('should trigger onBlur', () => {
      expect(onBlur).toHaveBeenCalledWith('todo');
    });
  });

  describe('onPressIcon', () => {
    beforeEach(() => {
      element = within(component).getByTestId('icon');

      fireEvent(element, 'onPress');
    });

    it('should trigger onPressIcon', () => {
      expect(onPressIcon).toHaveBeenCalled();
    });
  });

  describe('isLoading', () => {
    beforeEach(() => {
      rendered = render(
        <ThemeProvider>
          <TextInputIcon
            label={'My Label'}
            containerStyle={{
              backgroundColor: '#000000'
            }}
            textInputStyle={{
              fontSize: 15
            }}
            iconName="plus"
            iconSize={15}
            iconStyle={{
              marginLeft: 10
            }}
            onPressIcon={onPressIcon}
            isLoading={true}
            field={{
              name: 'todo',
              onBlur,
              onChange: jest.fn().mockImplementation(name => {
                switch (name) {
                  case 'todo':
                    return onChangeTodo;
                }
              }),
              value: 'Initial text'
            }}
            form={{
              errors: {},
              touched: {},
              setFieldTouched
            }}
            keyboardType="number-pad"
          />
        </ThemeProvider>
      );

      component = rendered.getByTestId('text-input-icon');
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('shows activity indicator', () => {
      expect(
        within(component).queryByTestId('activity-indicator')
      ).toBeTruthy();
    });

    it('does not show icon', () => {
      expect(within(component).queryByTestId('icon')).toBeFalsy();
    });
  });

  describe('hasError', () => {
    beforeEach(() => {
      rendered = render(
        <ThemeProvider>
          <TextInputIcon
            label={'My Label'}
            containerStyle={{
              backgroundColor: '#000000'
            }}
            textInputStyle={{
              fontSize: 15
            }}
            iconName="plus"
            iconSize={15}
            iconStyle={{
              marginLeft: 10
            }}
            onPressIcon={onPressIcon}
            isLoading={true}
            field={{
              name: 'todo',
              onBlur,
              onChange: jest.fn().mockImplementation(name => {
                switch (name) {
                  case 'todo':
                    return onChangeTodo;
                }
              }),
              value: 'Initial text'
            }}
            form={{
              errors: {
                todo: 'Please enter new todo.'
              },
              touched: {
                todo: true
              },
              setFieldTouched
            }}
            keyboardType="number-pad"
          />
        </ThemeProvider>
      );

      component = rendered.getByTestId('text-input-icon');
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('has error style', () => {
      expect(
        within(component).queryByTestId('input').props.style[2]
      ).toStrictEqual({
        borderColor: 'red',
        borderWidth: 1
      });
    });
  });
});
