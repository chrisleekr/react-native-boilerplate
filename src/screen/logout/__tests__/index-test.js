import React from 'react';
import * as redux from 'react-redux';
import {cleanup, render, waitFor} from '@testing-library/react-native';

import {ThemeProvider} from '../../../theme/useTheme';

import store from '../../../store/store';

import LogoutScreen from '../index';

let rendered;

const mockLogout = {type: 'LOGOUT'};

import * as authSlice from '../../../store/slice/authSlice';
const spyLogout = jest.spyOn(authSlice, 'logout');

const component = (
  <ThemeProvider>
    <redux.Provider store={store}>
      <LogoutScreen />
    </redux.Provider>
  </ThemeProvider>
);

describe('LogoutScreen', () => {
  afterEach(cleanup);

  beforeEach(() => {
    spyLogout.mockImplementation(() => mockLogout);
  });

  beforeEach(async () => {
    rendered = render(component);

    await waitFor(() => expect(rendered.toJSON()).not.toBeNull());
  });

  it('matches snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('triggers logout', () => {
    expect(spyLogout).toHaveBeenCalled();
  });
});
