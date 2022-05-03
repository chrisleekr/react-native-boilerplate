import {Text} from 'react-native';
import React from 'react';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import Layout from '../index';

let rendered;

describe('Layout', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <Layout>
          <Text testID="text">Test message</Text>
        </Layout>
      </ThemeProvider>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('shows text children', () => {
    expect(rendered.queryByTestId('text')).toBeTruthy();
  });
});
