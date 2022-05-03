import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '../../theme/useTheme';

import HomeNavigation from '../home';
import TodoNavigation from '../todo';
import AnotherPageNavigation from '../anotherPage';
import SamplePageNavigation from '../samplePage';

const Tab = createBottomTabNavigator();

export default function TabComponent() {
  const {theme} = useTheme();
  const screenOptionsHome = {
    title: 'Home'
  };

  const screenOptionsTodo = {
    title: 'Todo'
  };

  const screenOptionsAnotherPage = {
    title: 'Another Page'
  };

  const screenOptionsSamplePage = {
    title: 'Sample Page'
  };

  // Navigator icons causes rerender. But it's necessary. So ignore wdyr
  return (
    <Tab.Navigator
      initialRouteName="HomeNavigation"
      screenOptions={({route}) => ({
        lazy: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.layoutBg,
          color: theme.color
        },
        tabBarIcon: ({_focused, color, size}) => {
          if (route.name === 'HomeNavigation') {
            return <Icon name="home-city" size={size} color={color} />;
          } else if (route.name === 'TodoNavigation') {
            return <Icon name="map" size={size} color={color} />;
          } else if (route.name === 'AnotherPageNavigation') {
            return <Icon name="cog" size={size} color={color} />;
          } else {
            // TodoPageNavigation
            return <Icon name="firefox" size={size} color={color} />;
          }
        },
        tabBarInactiveTintColor: 'gray',
        tabBarActiveTintColor: 'tomato'
      })}>
      <Tab.Screen
        name="HomeNavigation"
        component={HomeNavigation}
        options={screenOptionsHome}
      />
      <Tab.Screen
        name="TodoNavigation"
        component={TodoNavigation}
        options={screenOptionsTodo}
      />
      <Tab.Screen
        name="AnotherPageNavigation"
        component={AnotherPageNavigation}
        options={screenOptionsAnotherPage}
      />
      <Tab.Screen
        name="SamplePageNavigation"
        component={SamplePageNavigation}
        options={screenOptionsSamplePage}
      />
    </Tab.Navigator>
  );
}
