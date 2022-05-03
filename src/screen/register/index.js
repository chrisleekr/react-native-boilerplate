import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {Field, Formik} from 'formik';
import * as yup from 'yup';

import {useTheme} from '../../theme/useTheme';

import {register, resetErrors} from '../../store/slice/authSlice';

import Layout from '../../component/layout';
import BackButton from '../../component/button/backButton';
import ButtonWithActivityIndicator from '../../component/button/buttonWithActivityIndicator';
import FormTextInput from '../../component/form/textInput';
import ErrorText from '../../component/form/errorText';

const registerValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email.')
    .required('Email address is required.'),
  username: yup.string().required('Username is required.'),
  password: yup
    .string()
    .min(6, ({min}) => `Password must be at least ${min} characters.`)
    .required('Password is required.'),
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.')
});

export default function RegisterScreen({testID, navigation}) {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const {loading, errors} = useSelector(state => state.auth);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetErrors());
    }, [dispatch])
  );

  const onRegister = async ({
    email,
    username,
    password,
    firstName,
    lastName
  }) => {
    dispatch(register({email, username, password, firstName, lastName})).then(
      result => {
        if (register.fulfilled.match(result)) {
          navigation.navigate('Register Success');
        }
      }
    );
  };

  const errorTexts = errors.reduce((acc, e) => {
    acc.push(<ErrorText key={e} text={e} />);
    return acc;
  }, []);

  return (
    <Layout testID={testID || 'register-screen'} style={styles.container}>
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
      <Text style={[styles.header, {color: theme.color}]}>Register!</Text>
      <Text style={[styles.text, {color: theme.color}]}>
        Register your account!
      </Text>
      <View testID="form-container" style={styles.formContainer}>
        <Formik
          initialValues={{
            email: '',
            username: '',
            password: '',
            firstName: '',
            lastName: ''
          }}
          validationSchema={registerValidationSchema}
          onSubmit={onRegister}>
          {({handleSubmit, isValid}) => (
            <>
              <Field
                testID="email-address-input"
                component={FormTextInput}
                label="Email Address"
                name="email"
                textInputStyle={styles.textInput}
                keyboardType="email-address"
              />

              <Field
                testID="username-input"
                component={FormTextInput}
                label="Username"
                name="username"
                textInputStyle={styles.textInput}
              />

              <Field
                testID="password-input"
                component={FormTextInput}
                label="Password"
                name="password"
                textInputStyle={styles.textInput}
                secureTextEntry
              />

              <Field
                testID="first-name-input"
                component={FormTextInput}
                label="First name"
                name="firstName"
                textInputStyle={styles.textInput}
              />

              <Field
                testID="last-name-input"
                component={FormTextInput}
                label="Last name"
                name="lastName"
                textInputStyle={styles.textInput}
              />

              {errorTexts}

              <ButtonWithActivityIndicator
                testID="register-button"
                onPress={handleSubmit}
                buttonStyle={styles.registerButtonContainer}
                text="Register"
                isLoading={loading !== 'idle'}
                disabled={!isValid || loading !== 'idle'}
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
  },
  formContainer: {
    marginTop: 10
  },
  textInput: {
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 10
  },
  registerButtonContainer: {
    marginBottom: 5
  }
});
