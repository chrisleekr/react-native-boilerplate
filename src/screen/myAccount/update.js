import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Field, Formik} from 'formik';
import * as yup from 'yup';

import {useTheme} from '../../theme/useTheme';

import {updateMe, resetErrors} from '../../store/slice/userSlice';

import Layout from '../../component/layout';
import BackButton from '../../component/button/backButton';
import FormTextInput from '../../component/form/textInput';
import ErrorText from '../../component/form/errorText';
import ButtonWithActivityIndicator from '../../component/button/buttonWithActivityIndicator';
import LabelText from '../../component/form/labelText';

const myAccountValidationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  email: yup
    .string()
    .email('Please enter valid email.')
    .required('Email address is required.'),
  password: yup
    .string()
    .min(6, ({min}) => `Password must be at least ${min} characters.`)
});

export default function MyAccountUpdateScreen({testID, navigation}) {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const {loading, user, errors} = useSelector(state => state.user);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetErrors());
    }, [dispatch])
  );

  const onUpdateMe = async ({email, password, firstName, lastName}) => {
    dispatch(updateMe({email, password, firstName, lastName})).then(result => {
      if (updateMe.fulfilled.match(result)) {
        navigation.navigate('My Account');
      }
    });
  };

  const errorTexts = errors.reduce((acc, e) => {
    acc.push(<ErrorText key={e} text={e} />);
    return acc;
  }, []);

  return (
    <Layout testID={testID || 'my-account-update'} style={styles.container}>
      <BackButton testID="back-button" goBack={navigation.goBack} />
      <Text testID="title" style={[styles.header, {color: theme.color}]}>
        Update my account
      </Text>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{
            email: user.email,
            password: '',
            firstName: user.first_name,
            lastName: user.last_name
          }}
          validationSchema={myAccountValidationSchema}
          onSubmit={onUpdateMe}>
          {({handleSubmit, isValid}) => (
            <>
              <LabelText
                testID="username-label"
                label="Username"
                text={user.username}
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

              <Field
                testID="password-input"
                component={FormTextInput}
                label="Password"
                name="password"
                textInputStyle={styles.textInput}
                secureTextEntry
              />

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
                testID="update-button"
                onPress={handleSubmit}
                buttonStyle={styles.updateButtonContainer}
                text="Update"
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
    marginTop: 30,
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
  updateButtonContainer: {
    marginBottom: 5
  }
});
