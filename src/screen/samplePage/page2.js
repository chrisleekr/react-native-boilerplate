import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';

import Layout from '../../component/layout';
import {useTheme} from '../../theme/useTheme';

export default function SamplePage2Screen({testID}) {
  const {theme} = useTheme();

  return (
    <Layout testID={testID || 'sample-page-2-screen'} style={styles.container}>
      <View style={styles.logoContainer}>
        <LottieView
          source={require('../../resource/lottie/react-native-logo.json')}
          autoPlay
          loop
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <Text style={[styles.header, {color: theme.color}]}>Sample page 2</Text>
      <Text style={[styles.text, {color: theme.color}]}>
        Use this screen as a way to quickly start any new project. All you get
        is this text and a mostly barebones screen.
      </Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginBottom: 10
  },
  logo: {
    width: 100
  },
  header: {
    width: '100%',
    textAlign: 'center',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 10
  }
});
