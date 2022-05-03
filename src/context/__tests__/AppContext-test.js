import React from 'react';
import {Text} from 'react-native';

import {cleanup, render} from '@testing-library/react-native';

import AppContext from '../AppContext';

let rendered;

describe('AppContext', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <AppContext>
        <Text testID="text">Test message</Text>
      </AppContext>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('should not show loading screen', () => {
    expect(rendered.queryByTestId('loading')).toBeFalsy();
  });

  it('shows text children', () => {
    expect(rendered.queryByTestId('text')).toBeTruthy();
  });
});
