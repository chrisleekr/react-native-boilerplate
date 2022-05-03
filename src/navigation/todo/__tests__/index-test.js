import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {cleanup, render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import TodoPageNavigation from '../index';

let rendered;

jest.mock('../../../component/button/headerLeftButton', () => props => (
  <header-left testID="header-left" {...props} />
));
jest.mock('../../../screen/todo', () => props => (
  <todo-page-screen testID="todo-page-screen" {...props} />
));

describe('TodoPageNavigation', () => {
  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <ThemeProvider>
        <NavigationContainer>
          <TodoPageNavigation />
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

  it('renders todo page screen', () => {
    expect(rendered.queryByTestId('todo-page-screen')).toBeTruthy();
  });
});
