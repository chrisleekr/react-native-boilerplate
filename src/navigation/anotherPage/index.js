import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTheme} from '../../theme/useTheme';

import HeaderLeftButton from '../../component/button/headerLeftButton';

import AnohterPageScreen from '../../screen/anotherPage';

const AnotherPageStack = createNativeStackNavigator();

export default function AnotherPageNavigation({testID}) {
  const {theme} = useTheme();

  const screenOptionsNavigator = ({navigation}) => ({
    headerStyle: {
      backgroundColor: theme.layoutBg
    },
    headerTintColor: theme.color,
    headerTitleStyle: {
      fontWeight: 'normal'
    },
    animationEnabled: true,
    animation: 'slide_from_right',
    headerLeft: () => <HeaderLeftButton navigation={navigation} />
  });

  const screenOptionsAnotherPageScreen = {
    title: ' Another Page',
    headerStyle: {
      backgroundColor: theme.headerBg
    }
  };

  return (
    <AnotherPageStack.Navigator
      testID={testID || 'another-page-navigator'}
      initialRouteName="AnotherPageScreen"
      screenOptions={screenOptionsNavigator}>
      <AnotherPageStack.Screen
        testID={testID || 'another-page-screen'}
        name="AnotherPageScreen"
        options={screenOptionsAnotherPageScreen}>
        {props => <AnohterPageScreen {...props} />}
      </AnotherPageStack.Screen>
    </AnotherPageStack.Navigator>
  );
}
