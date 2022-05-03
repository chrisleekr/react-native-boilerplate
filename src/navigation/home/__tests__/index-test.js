import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import HomeNavigation from '../index';

let rendered;

jest.mock('../../../component/button/headerLeftButton', () => props => (
  <header-left testID="header-left" {...props} />
));
jest.mock('../../../screen/home', () => props => (
  <home-screen testID="home-screen" {...props} />
));

describe('HomeNavigation', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <NavigationContainer>
          <HomeNavigation />
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

  it('renders home screen', () => {
    expect(rendered.queryByTestId('home-screen')).toBeTruthy();
  });
});
