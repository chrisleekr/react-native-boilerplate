import React from 'react';
import {
  cleanup,
  render,
  waitFor,
  fireEvent
} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import SuccessScreen from '../success';

let rendered;

const mockNavigate = jest.fn();

const component = (
  <ThemeProvider>
    <SuccessScreen navigation={{navigate: mockNavigate}} />
  </ThemeProvider>
);

describe('SuccessScreen', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    rendered = render(component);

    await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  describe('goBack', () => {
    beforeEach(async () => {
      fireEvent.press(rendered.getByTestId('back-button'));
    });

    it('triggers navigate', () => {
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });
});
