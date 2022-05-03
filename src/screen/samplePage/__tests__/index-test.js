import React from 'react';
import {cleanup, render, waitFor} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import SamplePageScreen from '../index';

// react-native-tab-view is not possible to test. So assuming it's just working and mock it.
jest.mock('react-native-tab-view', () => ({
  TabView: props => <tab-view testID="tab-view" {...props} />,
  TabBar: props => <tab-bar testID="tab-bar" {...props} />,
  SceneMap: jest.fn()
}));

let rendered;

const component = (
  <ThemeProvider>
    <SamplePageScreen />
  </ThemeProvider>
);

describe('SamplePageScreen', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    rendered = render(component);

    await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  describe('trigger tab-bar render', () => {
    beforeEach(() => {
      rendered.getByTestId('tab-view').props.renderTabBar();
    });

    it('matches snapshot', () => {
      expect(rendered.toJSON()).toMatchSnapshot();
    });
  });
});
