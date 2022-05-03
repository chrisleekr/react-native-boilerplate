import 'react-native';
import React from 'react';

import {cleanup, render, fireEvent} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import BackButton from '../backButton';

let rendered;
let goBack;

describe('BackButton', () => {
  afterEach(cleanup);

  beforeEach(() => {
    goBack = jest.fn();

    rendered = render(
      <ThemeProvider>
        <BackButton goBack={goBack} />
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

    it('triggers goBack', () => {
      expect(goBack).toHaveBeenCalled();
    });
  });
});
