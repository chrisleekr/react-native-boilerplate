import 'react-native';
import React from 'react';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import ErrorText from '../errorText';

let rendered;
let element;

describe('ErrorText', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <ErrorText textStyle={{fontSize: 13}} text={'My Text'} />
      </ThemeProvider>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
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
