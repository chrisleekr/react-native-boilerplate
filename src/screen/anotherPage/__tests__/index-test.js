import React from 'react';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import AnotherPageScreen from '../index';

let rendered;

describe('AnotherPageScreen', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <AnotherPageScreen />
      </ThemeProvider>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders another page screen', () => {
    expect(rendered.queryByTestId('another-page-screen')).toBeTruthy();
  });

  it('renders logo', () => {
    expect(rendered.queryByTestId('logo')).toBeTruthy();
  });

  it('renders title', () => {
    expect(rendered.queryByTestId('title')).toBeTruthy();
  });

  it('renders content', () => {
    expect(rendered.queryByTestId('content')).toBeTruthy();
  });
});
