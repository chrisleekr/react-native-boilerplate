import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTheme} from '../../theme/useTheme';

import HeaderLeftButton from '../../component/button/headerLeftButton';

import SamplePageScreen from '../../screen/samplePage';

const SamplePageStack = createNativeStackNavigator();

export default function AnotherPageNavigation() {
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

  const screenOptionsSamplePageScreen = {
    title: 'Sample Pages',
    headerStyle: {
      backgroundColor: theme.headerBg
    }
  };

  return (
    <SamplePageStack.Navigator
      initialRouteName="SamplePageScreen"
      screenOptions={screenOptionsNavigator}>
      <SamplePageStack.Screen
        name="SamplePageScreen"
        options={screenOptionsSamplePageScreen}>
        {props => <SamplePageScreen {...props} />}
      </SamplePageStack.Screen>
    </SamplePageStack.Navigator>
  );
}
