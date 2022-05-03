import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';

import {useTheme} from '../../theme/useTheme';

import Layout from '../../component/layout';
import BackButton from '../../component/button/backButton';

export default function ForgotPasswordRequestSuccessScreen({
  testID,
  navigation
}) {
  const {theme} = useTheme();

  return (
    <Layout
      testID={testID || 'forgot-password-request-success-screen'}
      style={styles.container}>
      <BackButton
        testID="back-button"
        goBack={() => navigation.navigate('Login')}
      />
      <View style={styles.logoContainer}>
        <LottieView
          source={require('../../resource/lottie/react-native-logo.json')}
          autoPlay
          loop
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <Text style={[styles.header, {color: theme.color}]}>
        We sent you an email.
      </Text>
      <Text style={[styles.text, {color: theme.color}]}>
        Your password reset link is sent. To reset your password, please check
        your email and click the link to reset. If you cannot check in the
        inbox, then make sure you check your spam folder as well.
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  logo: {
    width: 50
  },
  header: {
    fontSize: 21,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 10,
    marginBottom: 10
  }
});
