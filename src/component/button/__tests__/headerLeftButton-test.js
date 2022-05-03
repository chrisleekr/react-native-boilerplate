import 'react-native';
import React from 'react';

import {cleanup, render, fireEvent} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import HeaderLeftButton from '../headerLeftButton';

let rendered;
let toggleDrawer;

describe('HeaderLeftButton', () => {
  afterEach(cleanup);

  beforeEach(() => {
    toggleDrawer = jest.fn();

    rendered = render(
      <ThemeProvider>
        <HeaderLeftButton navigation={{toggleDrawer}} />
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

    it('triggers toggleDrawer', () => {
      expect(toggleDrawer).toHaveBeenCalled();
    });
  });
});
