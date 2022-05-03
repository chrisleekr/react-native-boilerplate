import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTheme} from '../../theme/useTheme';

import HeaderLeftButton from '../../component/button/headerLeftButton';

import TodoPageScreen from '../../screen/todo';

const TodoStack = createNativeStackNavigator();

export default function TodoPageNavigation() {
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

  const screenOptionsTodoPageScreen = {
    title: 'Todo',
    headerStyle: {
      backgroundColor: theme.headerBg
    }
  };

  return (
    <TodoStack.Navigator
      initialRouteName="TodoPageScreen"
      screenOptions={screenOptionsNavigator}>
      <TodoStack.Screen
        name="TodoPageScreen"
        options={screenOptionsTodoPageScreen}>
        {props => <TodoPageScreen {...props} />}
      </TodoStack.Screen>
    </TodoStack.Navigator>
  );
}
