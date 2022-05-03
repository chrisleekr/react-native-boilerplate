import 'react-native';
import React from 'react';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import LabelText from '../labelText';

let rendered;
let element;

describe('LabelText', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <LabelText
          containerStyle={{backgroundColor: '#000000'}}
          labelStyle={{backgroundColor: '#EFEFEF'}}
          label={'My Label'}
          textStyle={{fontSize: 13}}
          text={'My Text'}
        />
      </ThemeProvider>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  describe('label', () => {
    beforeEach(() => {
      element = rendered.getByText('My Label');
    });

    it('rendered label', () => {
      expect(element).toBeTruthy();
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
