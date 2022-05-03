import 'react-native';
import React from 'react';

import {cleanup, fireEvent, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import TodoCard from '../todoCard';

let rendered;
let element;

let todo;

const leftIconOnPress = jest.fn();
const rightIconOnPress = jest.fn();

describe('TodoCard', () => {
  afterEach(cleanup);

  beforeEach(() => {
    todo = {
      state: 'ongoing',
      name: 'My todo'
    };
    rendered = render(
      <ThemeProvider>
        <TodoCard
          loading={false}
          leftIconOnPress={leftIconOnPress}
          leftIconName={'checkbox-blank-circle-outline'}
          leftIconSize={20}
          leftIconColor="#000000"
          todo={todo}
          rightIconOnPress={rightIconOnPress}
          rightIconName="trash-can-outline"
          rightIconSize={20}
          rightIconColor="#000000"
        />
      </ThemeProvider>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  describe('left-icon', () => {
    beforeEach(() => {
      element = rendered.getByTestId('left-icon');
    });

    it('rendered left-icon', () => {
      expect(element).toBeTruthy();
    });

    it('sets left-icon as enabled', () => {
      expect(element.props.accessibilityState).toStrictEqual({disabled: false});
    });

    describe('leftIconOnPress', () => {
      beforeEach(() => {
        fireEvent(element, 'onPress');
      });

      it('triggers onPress', () => {
        expect(leftIconOnPress).toHaveBeenCalled();
      });
    });
  });

  describe('text', () => {
    beforeEach(() => {
      element = rendered.getByText('My todo');
    });

    it('rendered text', () => {
      expect(element).toBeTruthy();
    });
  });

  describe('right-icon', () => {
    beforeEach(() => {
      element = rendered.getByTestId('right-icon');
    });

    it('rendered right-icon', () => {
      expect(element).toBeTruthy();
    });

    it('sets right-icon as enabled', () => {
      expect(element.props.accessibilityState).toStrictEqual({disabled: false});
    });

    describe('rightIconOnPress', () => {
      beforeEach(() => {
        fireEvent(element, 'onPress');
      });

      it('triggers onPress', () => {
        expect(rightIconOnPress).toHaveBeenCalled();
      });
    });
  });

  describe('todo with completed', () => {
    beforeEach(() => {
      todo = {
        state: 'completed',
        name: 'My completed todo'
      };
      rendered = render(
        <ThemeProvider>
          <TodoCard
            loading={false}
            leftIconOnPress={leftIconOnPress}
            leftIconName={'checkbox-marked-circle'}
            leftIconSize={20}
            leftIconColor="#000000"
            todo={todo}
            rightIconOnPress={rightIconOnPress}
            rightIconName="trash-can-outline"
            rightIconSize={20}
            rightIconColor="#000000"
          />
        </ThemeProvider>
      );
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });

  describe('loading is true', () => {
    beforeEach(() => {
      todo = {
        state: 'ongoing',
        name: 'My todo'
      };
      rendered = render(
        <ThemeProvider>
          <TodoCard
            loading={true}
            leftIconOnPress={leftIconOnPress}
            leftIconName={'checkbox-blank-circle-outline'}
            leftIconSize={20}
            leftIconColor="#000000"
            todo={todo}
            rightIconOnPress={rightIconOnPress}
            rightIconName="trash-can-outline"
            rightIconSize={20}
            rightIconColor="#000000"
          />
        </ThemeProvider>
      );
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });

    it('sets left-icon as disabled', () => {
      expect(
        rendered.getByTestId('left-icon').props.accessibilityState
      ).toStrictEqual({disabled: true});
    });

    it('sets right-icon as disabled', () => {
      expect(
        rendered.getByTestId('right-icon').props.accessibilityState
      ).toStrictEqual({disabled: true});
    });
  });
});
