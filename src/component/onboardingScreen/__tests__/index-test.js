import React from 'react';

import {cleanup, render} from '@testing-library/react-native';

import OnboardingScreen from '../index';

let rendered;
let props;

const createTestProps = testProps => ({
  navigation: {
    jumpTo: jest.fn()
  },
  ...testProps
});

describe('OnboardingScreen', () => {
  afterEach(cleanup);

  beforeEach(() => {
    props = createTestProps({});

    rendered = render(<OnboardingScreen {...props} />);
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
