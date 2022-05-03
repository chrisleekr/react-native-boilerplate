import React from 'react';
import {StyleSheet, LogBox} from 'react-native';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppContextProvider from './src/context/AppContext';
import MainNavigation from './src/navigation/main';
import NoInternetToast from './src/component/general/noInternet';

// https://github.com/facebook/react-native/issues/33557#issuecomment-1093083115
LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);

const App = () => {
  return (
    <AppContextProvider>
      <GestureHandlerRootView style={styles.gesture}>
        <SafeAreaProvider>
          <MainNavigation />
          <NoInternetToast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
      <Toast />
    </AppContextProvider>
  );
};

const styles = StyleSheet.create({
  gesture: {
    flex: 1
  },
  loadingImage: {
    width: 200,
    height: 200
  }
});

export default App;
