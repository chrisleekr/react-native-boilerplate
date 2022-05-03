import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTheme} from '../../theme/useTheme';

import HeaderLeftButton from '../../component/button/headerLeftButton';
import HeaderRightButton from '../../component/button/headerRightButton';

import HomePageScreen from '../../screen/home';

const HomeStack = createNativeStackNavigator();

export default function HomeNavigation() {
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
    headerLeft: () => <HeaderLeftButton navigation={navigation} />,
    headerRight: () => <HeaderRightButton navigation={navigation} />
  });

  const screenOptionsHomePageScreen = {
    title: 'Home',
    headerStyle: {
      backgroundColor: theme.headerBg
    }
  };

  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={({navigation}) => screenOptionsNavigator({navigation})}>
      <HomeStack.Screen name="Home" options={screenOptionsHomePageScreen}>
        {props => <HomePageScreen {...props} />}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}
