import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {Field, Formik} from 'formik';
import * as yup from 'yup';

import {useTheme} from '../../theme/useTheme';

import {login, resetErrors} from '../../store/slice/authSlice';

import Layout from '../../component/layout';
import BackButton from '../../component/button/backButton';
import ButtonLink from '../../component/button/buttonLink';
import ButtonWithActivityIndicator from '../../component/button/buttonWithActivityIndicator';
import FormTextInput from '../../component/form/textInput';
import ErrorText from '../../component/form/errorText';

const loginValidationSchema = yup.object().shape({
  username: yup
    .string()
    .email('Please enter valid email.')
    .required('Email address is required.'),
  password: yup
    .string()
    .min(6, ({min}) => `Password must be at least ${min} characters.`)
    .required('Password is required.')
});

export default function LoginScreen({testID, navigation}) {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const {loading, errors} = useSelector(state => state.auth);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetErrors());
    }, [dispatch])
  );

  const onLogin = useCallback(
    ({username, password}) => {
      dispatch(login({username, password}));
    },
    [dispatch]
  );

  const errorTexts = errors.reduce((acc, e) => {
    acc.push(<ErrorText key={e} text={e} />);
    return acc;
  }, []);

  return (
    <Layout testID={testID || 'login-screen'} style={styles.container}>
      <BackButton testID="back-button" goBack={navigation.goBack} />
      <View style={styles.logoContainer}>
        <LottieView
          source={require('../../resource/lottie/react-native-logo.json')}
          autoPlay
          loop
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <Text style={[styles.header, {color: theme.color}]}>Welcome back!</Text>
      <Text style={[styles.text, {color: theme.color}]}>
        Sign in to your account
      </Text>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{username: '', password: ''}}
          validationSchema={loginValidationSchema}
          onSubmit={onLogin}>
          {({handleSubmit, isValid}) => (
            <>
              <Field
                testID="email-address-input"
                component={FormTextInput}
                label="Email Address"
                name="username"
                textInputStyle={styles.textInput}
                keyboardType="email-address"
              />

              <Field
                testID="password-input"
                component={FormTextInput}
                label="Password"
                name="password"
                textInputStyle={styles.textInput}
                secureTextEntry
              />

              <ButtonLink
                testID="forgot-password-button"
                onPress={() => navigation.jumpTo('Forgot Password')}
                text="Forgot your password?"
                buttonStyle={styles.forgotPasswordLink}
              />

              {errorTexts}

              <ButtonWithActivityIndicator
                testID="login-button"
                onPress={handleSubmit}
                buttonStyle={styles.loginButtonContainer}
                text="Login"
                isLoading={loading !== 'idle'}
                disabled={!isValid || loading !== 'idle'}
              />

              <ButtonLink
                testID="signup-button"
                onPress={() => navigation.jumpTo('Register')}
                text="Don't have an account? Signup"
                buttonStyle={styles.signupLink}
              />
            </>
          )}
        </Formik>
      </View>
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
    height: 300
  },
  logo: {
    width: 150
  },
  header: {
    fontSize: 21,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 10,
    marginBottom: 10
  },
  formContainer: {
    marginTop: 10
  },
  textInput: {
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 10
  },
  forgotPasswordLink: {
    textAlign: 'right',
    marginBottom: 10
  },
  loginButtonContainer: {
    marginBottom: 5
  },
  signupLink: {
    textAlign: 'center',
    marginBottom: 10
  }
});
