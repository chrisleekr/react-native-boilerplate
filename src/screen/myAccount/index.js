import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import {useTheme} from '../../theme/useTheme';

import {me, resetErrors} from '../../store/slice/userSlice';

import Layout from '../../component/layout';
import BackButton from '../../component/button/backButton';
import LabelText from '../../component/form/labelText';
import ButtonWithActivityIndicator from '../../component/button/buttonWithActivityIndicator';

export default function MyAccountScreen({testID, navigation}) {
  const {theme} = useTheme();

  const [loadingMe, setLoadingMe] = useState(true);

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);

  useFocusEffect(
    useCallback(() => {
      setLoadingMe(true);
      dispatch(resetErrors());
      dispatch(me()).then(result => {
        if (me.fulfilled.match(result)) {
          setLoadingMe(false);
        }
      });
    }, [dispatch])
  );

  const onPress = () => {
    navigation.navigate('Update My Account');
  };

  if (loadingMe) {
    return (
      <Layout testID={testID || 'my-account-loading'} style={styles.container}>
        <BackButton testID="back-button" goBack={navigation.goBack} />
        <Text testID="title" style={[styles.header, {color: theme.color}]}>
          My Account
        </Text>
        <View testID="loading-container" style={styles.logoContainer}>
          <LottieView
            testID="loading"
            source={require('../../resource/lottie/react-native-logo.json')}
            autoPlay
            loop
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
      </Layout>
    );
  }

  return (
    <Layout testID={testID || 'my-account'} style={styles.container}>
      <BackButton testID="back-button" goBack={navigation.goBack} />
      <Text testID="title" style={[styles.header, {color: theme.color}]}>
        My Account
      </Text>
      <View testID="me-container" style={styles.formContainer}>
        <LabelText testID="username" label="Username" text={user.username} />
        <LabelText
          testID="name"
          label="Name"
          text={`${user.first_name}, ${user.last_name}`}
        />
        <LabelText testID="email" label="Email" text={user.email} />
        <LabelText
          testID="last-login-at"
          label="Last login at"
          text={`${user.last_login_at} (${user.last_login_ip})`}
        />

        <ButtonWithActivityIndicator
          testID="update-information-button"
          onPress={onPress}
          buttonStyle={styles.updateButtonContainer}
          text="Update information"
          isLoading={false}
          disabled={false}
        />
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
  header: {
    marginTop: 30,
    fontSize: 21,
    fontWeight: 'bold'
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
  formContainer: {
    marginTop: 10
  },
  updateButtonContainer: {
    marginBottom: 5
  }
});
