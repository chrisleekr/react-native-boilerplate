import React from 'react';
import {cleanup, render, waitFor} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import SamplePage2Screen from '../page2';

// react-native-tab-view is not possible to test. So assuming it's just working and mock it.
jest.mock('react-native-tab-view', () => ({
  TabView: props => <tab-view testID="tab-view" {...props} />,
  TabBar: props => <tab-bar testID="tab-bar" {...props} />,
  SceneMap: jest.fn()
}));

let rendered;

const component = (
  <ThemeProvider>
    <SamplePage2Screen />
  </ThemeProvider>
);

describe('SamplePage2Screen', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    rendered = render(component);

    await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
