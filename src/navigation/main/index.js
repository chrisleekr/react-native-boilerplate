import React, {useEffect, useState} from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';

import {useTheme} from '../../theme/useTheme';

import {initialise} from '../../store/slice/authSlice';

import TabComponent from './tab';

import Loading from '../../component/general/loading';
import OnboardingScreen from '../../component/onboardingScreen';

import LoginScreen from '../../screen/login';
import RegisterScreen from '../../screen/register';
import RegisterSuccessScreen from '../../screen/register/success';
import MyAccountScreen from '../../screen/myAccount';
import LogoutScreen from '../../screen/logout';
import ForgotPasswordScreen from '../../screen/forgotPassword';
import ForgotPasswordSuccessScreen from '../../screen/forgotPassword/success';
import MyAccountUpdateScreen from '../../screen/myAccount/update';
import SettingScreen from '../../screen/setting';

const Drawer = createDrawerNavigator();

export default function MainNavigation({testID}) {
  const {theme} = useTheme();
  const dispatch = useDispatch();

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const {isAuthenticated} = useSelector(state => state.auth);

  useEffect(() => {
    async function checkLaunchStatus() {
      const value = await AsyncStorage.getItem('alreadyLaunched');

      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    }
    checkLaunchStatus();
    dispatch(initialise());
  }, [dispatch]);

  if (isFirstLaunch === null) {
    return <Loading />;
  }

  // If it is a first launch, then show the onboarding screen.
  // If it is not a first launch, then show the main navigation
  const initialRouteName = isFirstLaunch ? 'Welcome to App!' : 'App';

  return (
    <SafeAreaView testID={testID || 'main-navigation'} style={styles.container}>
      <StatusBar
        animated
        backgroundColor={theme.accent}
        barStyle={theme.barStyle}
      />
      <NavigationContainer onReady={() => RNBootSplash.hide()}>
        <Drawer.Navigator initialRouteName={initialRouteName}>
          <Drawer.Group>
            <Drawer.Screen
              name="App"
              options={{
                headerShown: false,
                drawerItemStyle: {
                  display: 'none'
                }
              }}>
              {props => <TabComponent {...props} />}
            </Drawer.Screen>
            <Drawer.Screen
              name="Welcome to App!"
              options={{
                headerShown: false,
                drawerItemStyle: {
                  display: 'none'
                }
              }}>
              {props => <OnboardingScreen {...props} />}
            </Drawer.Screen>
          </Drawer.Group>
          <Drawer.Group>
            {isAuthenticated ? (
              <>
                <Drawer.Screen name="My Account" options={{headerShown: false}}>
                  {props => <MyAccountScreen {...props} />}
                </Drawer.Screen>
                <Drawer.Screen
                  name="Update My Account"
                  options={{
                    headerShown: false,
                    drawerItemStyle: {
                      display: 'none'
                    }
                  }}>
                  {props => <MyAccountUpdateScreen {...props} />}
                </Drawer.Screen>
                <Drawer.Screen name="Logout" options={{headerShown: false}}>
                  {props => <LogoutScreen {...props} />}
                </Drawer.Screen>
              </>
            ) : (
              <>
                <Drawer.Screen name="Login" options={{headerShown: false}}>
                  {props => <LoginScreen {...props} />}
                </Drawer.Screen>
                <Drawer.Screen name="Register" options={{headerShown: false}}>
                  {props => <RegisterScreen {...props} />}
                </Drawer.Screen>
                <Drawer.Screen
                  name="Register Success"
                  options={{
                    headerShown: false,
                    drawerItemStyle: {
                      display: 'none'
                    }
                  }}>
                  {props => <RegisterSuccessScreen {...props} />}
                </Drawer.Screen>
                <Drawer.Screen
                  name="Forgot Password"
                  options={{
                    headerShown: false,
                    drawerItemStyle: {
                      display: 'none'
                    }
                  }}>
                  {props => <ForgotPasswordScreen {...props} />}
                </Drawer.Screen>
                <Drawer.Screen
                  name="Forgot Password Success"
                  options={{
                    headerShown: false,
                    drawerItemStyle: {
                      display: 'none'
                    }
                  }}>
                  {props => <ForgotPasswordSuccessScreen {...props} />}
                </Drawer.Screen>
              </>
            )}
            <Drawer.Screen
              name="Settings"
              options={{
                headerShown: false,
                drawerItemStyle: {
                  display: 'none'
                }
              }}>
              {props => <SettingScreen {...props} />}
            </Drawer.Screen>
          </Drawer.Group>
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1}
});
