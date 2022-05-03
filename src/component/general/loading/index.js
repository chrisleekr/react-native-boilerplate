import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';

import {useTheme} from '../../../theme/useTheme';

const Loading = ({testID}) => {
  const {theme} = useTheme();

  return (
    <View
      testID={testID || 'loading'}
      style={[styles.container, {backgroundColor: theme.layoutBg}]}>
      <LottieView
        testID="lottie"
        style={[styles.loadingImage]}
        source={require('../../../resource/lottie/react-native-logo.json')}
        autoPlay
        loop
        resizeMode="cover"
      />
    </View>
  );
};

export default memo(Loading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingImage: {
    width: 200,
    height: 200
  }
});
