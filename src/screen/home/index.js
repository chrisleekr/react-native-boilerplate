import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';

import Layout from '../../component/layout';
import {useTheme} from '../../theme/useTheme';

export default function HomeScreen({testID}) {
  const {theme} = useTheme();

  const {isAuthenticated} = useSelector(state => state.auth);

  if (isAuthenticated === false) {
    return (
      <Layout testID={testID || 'home-not-auth'} style={styles.container}>
        <View testID="logo" style={styles.logoContainer}>
          <LottieView
            source={require('../../resource/lottie/react-native-logo.json')}
            autoPlay
            loop
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <Text testID="title" style={[styles.header, {color: theme.color}]}>
          Starter screen
        </Text>
        <Text testID="content" style={[styles.text, {color: theme.color}]}>
          Use this screen as a way to quickly start any new project. All you get
          is this text and a mostly barebones screen.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout testID={testID || 'home-authed'} style={styles.container}>
      <View testID="logo" style={styles.logoContainer}>
        <LottieView
          source={require('../../resource/lottie/react-native-logo.json')}
          autoPlay
          loop
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <Text testID="title" style={[styles.header, {color: theme.color}]}>
        You are logged in.
      </Text>
      <Text testID="content" style={[styles.text, {color: theme.color}]}>
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
