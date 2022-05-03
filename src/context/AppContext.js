import React, {createContext} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {ThemeProvider} from '../theme/useTheme';
import store, {persistor} from '../store/store';

import Loading from '../component/general/loading';

const AppContext = createContext();

const AppContextProvider = ({children}) => {
  const appInitialState = {};

  return (
    <AppContext.Provider value={appInitialState}>
      <ThemeProvider>
        <Provider store={store}>
          <PersistGate loading={<Loading />} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default AppContextProvider;
