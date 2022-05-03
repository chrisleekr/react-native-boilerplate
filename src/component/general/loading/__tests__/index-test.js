import 'react-native';
import React from 'react';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../../theme/useTheme';

import Loading from '../index';

let rendered;

describe('Loading', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <Loading />
      </ThemeProvider>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('shows lottie', () => {
    expect(rendered.queryByTestId('lottie')).toBeTruthy();
  });
});
