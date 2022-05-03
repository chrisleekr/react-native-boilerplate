import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import SamplePageNavigation from '../index';

let rendered;

jest.mock('../../../component/button/headerLeftButton', () => props => (
  <header-left testID="header-left" {...props} />
));
jest.mock('../../../screen/samplePage', () => props => (
  <sample-page-screen testID="sample-page-screen" {...props} />
));

describe('SamplePageNavigation', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <NavigationContainer>
          <SamplePageNavigation />
        </NavigationContainer>
      </ThemeProvider>
    );
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders header left', () => {
    expect(rendered.queryByTestId('header-left')).toBeTruthy();
  });

  it('renders sample page screen', () => {
    expect(rendered.queryByTestId('sample-page-screen')).toBeTruthy();
  });
});
