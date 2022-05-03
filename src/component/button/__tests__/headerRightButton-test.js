import 'react-native';
import React from 'react';

import {cleanup, render, fireEvent} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import HeaderRightButton from '../headerRightButton';

let rendered;
let navigate;

describe('HeaderRightButton', () => {
  afterEach(cleanup);

  beforeEach(() => {
    navigate = jest.fn();

    rendered = render(
      <ThemeProvider>
        <HeaderRightButton navigation={{navigate}} />
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

    it('triggers navigate', () => {
      expect(navigate).toHaveBeenCalled();
    });
  });
});
