import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {Field, Formik} from 'formik';
import * as yup from 'yup';

import {useTheme} from '../../theme/useTheme';

import {passwordResetRequest, resetErrors} from '../../store/slice/authSlice';

import Layout from '../../component/layout';
import BackButton from '../../component/button/backButton';
import ButtonWithActivityIndicator from '../../component/button/buttonWithActivityIndicator';
import FormTextInput from '../../component/form/textInput';
import ErrorText from '../../component/form/errorText';

const passwordResetRequestValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email.')
    .required('Email address is required.')
});

export default function ForgotPasswordScreen({testID, navigation}) {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const {loading, errors} = useSelector(state => state.auth);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetErrors());
    }, [dispatch])
  );

  const onPasswordRequest = async ({email}) => {
    dispatch(passwordResetRequest({email})).then(result => {
      if (passwordResetRequest.fulfilled.match(result)) {
        navigation.navigate('Forgot Password Success');
      }
    });
  };

  const errorTexts = errors.reduce((acc, e) => {
    acc.push(<ErrorText key={e} text={e} />);
    return acc;
  }, []);

  return (
    <Layout
      testID={testID || 'password-reset-request-screen'}
      style={styles.container}>
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
      <Text style={[styles.header, {color: theme.color}]}>
        Find my password !
      </Text>
      <Text style={[styles.text, {color: theme.color}]}>
        To reset your password, enter your email address.
      </Text>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{email: ''}}
          validationSchema={passwordResetRequestValidationSchema}
          onSubmit={onPasswordRequest}>
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

              {errorTexts}

              <ButtonWithActivityIndicator
                testID="reset-button"
                onPress={handleSubmit}
                buttonStyle={[styles.resetButtonContainer]}
                text="Request new password"
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
  resetButtonContainer: {
    marginBottom: 5
  }
});
