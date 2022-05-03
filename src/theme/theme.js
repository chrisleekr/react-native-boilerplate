import {Dimensions} from 'react-native';
import {colors} from './colors';
const {width, height} = Dimensions.get('window');

// Themes:- Can alter values here. Can only be consumed through Context (see useTheme.js file)
const themes = {
  light: {
    name: 'light',
    barStyle: 'light-content',
    color: '#000000',
    labelColor: '#525E75',
    invertColor: '#ffffff',
    layoutBg: '#f0f0f0',
    headerBg: '#f6f7f8',
    cardBg: '#e4dfa7',
    accent: '#0071ff',
    error: '#B00020',
    errorText: '#ed4337',
    lightBg: '#F5EE9E',
    borderColor: '#B00020',
    buttonActiveColor: '#6200EE',
    buttonDisabledColor: 'rgba(0, 0, 0, 0.26)',
    card: {
      shadowColor: '#000000',
      borderColor: '#B00020'
    },
    ...colors
  },
  dark: {
    name: 'dark',
    barStyle: 'dark-content',
    color: '#ffffff',
    labelColor: '#F1DDBF',
    invertColor: '#000000',
    layoutBg: '#121212',
    headerBg: '#1e1e1e',
    cardBg: '#3f4045',
    accent: '#0071ff',
    error: '#B00020',
    errorText: '#ed4337',
    lightBg: '#F5EE9E',
    borderColor: '#ffffff',
    buttonActiveColor: '#BB86FC',
    buttonDisabledColor: 'rgba(255,255,255, 0.26)',
    card: {
      shadowColor: '#121212',
      borderColor: '#ffffff'
    },
    ...colors
  }
};

const window = {
  // app dimensions
  width,
  height
};

export {themes, window};
