import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  waitFor
} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';

import {ThemeProvider} from '../../../theme/useTheme';

import TabComponent from '../tab';

let rendered;

jest.mock('../../home', () => props => (
  <home-navigation testID="home-navigation" {...props} />
));
jest.mock('../../todo', () => props => (
  <todo-navigation testID="todo-navigation" {...props} />
));
jest.mock('../../anotherPage', () => props => (
  <another-page-navigation testID="another-page-navigation" {...props} />
));
jest.mock('../../samplePage', () => props => (
  <sample-page-navigation testID="sample-page-navigation" {...props} />
));

const component = (
  <ThemeProvider>
    <NavigationContainer>
      <TabComponent />
    </NavigationContainer>
  </ThemeProvider>
);

describe('TabComponent', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    rendered = render(component);

    await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
  });

  it('matches snapshot', async () => {
    expect(await rendered.toJSON()).toMatchSnapshot();
  });

  it('renders home navigation', () => {
    expect(rendered.queryByTestId('home-navigation')).toBeTruthy();
  });

  [
    {
      name: 'Todo',
      component: 'todo-navigation'
    },
    {
      name: 'Another Page',
      component: 'another-page-navigation'
    },
    {
      name: 'Sample Page',
      component: 'sample-page-navigation'
    }
  ].forEach(t => {
    it(`shows ${t.name} menu`, () => {
      expect(rendered.getByText(t.name)).toBeTruthy();
    });

    describe(`tests ${t.name} screen`, () => {
      beforeEach(async () => {
        fireEvent(await rendered.findByText(t.name), 'press');
      });

      it(`matches snapshot for ${t.name} screen`, async () => {
        expect(await rendered.toJSON()).toMatchSnapshot();
      });

      it(`shows ${t.name} screen`, async () => {
        await waitFor(() =>
          expect(rendered.queryByTestId(t.component)).toBeTruthy()
        );
      });
    });
  });
});
