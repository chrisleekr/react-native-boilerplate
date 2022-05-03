import 'react-native';
import React from 'react';

import {cleanup, render, fireEvent} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import ButtonLink from '../buttonLink';

let rendered;
let element;
let onPress;

describe('ButtonLink', () => {
  afterEach(cleanup);

  beforeEach(() => {
    onPress = jest.fn();

    rendered = render(
      <ThemeProvider>
        <ButtonLink
          onPress={onPress}
          buttonStyle={{
            fontSize: 13
          }}
          text={'My Text'}
        />
      </ThemeProvider>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
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
