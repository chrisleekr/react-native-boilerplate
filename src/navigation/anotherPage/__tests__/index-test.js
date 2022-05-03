import React from 'react';

import {cleanup, render} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';

import {ThemeProvider} from '../../../theme/useTheme';

import AnotherPageNavigation from '../index';

jest.mock('../../../component/button/headerLeftButton', () => props => (
  <header-left testID="header-left" {...props} />
));
jest.mock('../../../screen/anotherPage', () => props => (
  <another-page-screen testID="another-page-screen" {...props} />
));

let rendered;

describe('AnotherPageNavigation', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <NavigationContainer>
          <AnotherPageNavigation />
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

  it('renders another page screen', () => {
    expect(rendered.queryByTestId('another-page-screen')).toBeTruthy();
  });
});
