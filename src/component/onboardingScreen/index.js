import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';

const Square = ({selected}) => {
  const backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
  return (
    <View
      testID="dots-square"
      style={[
        styles.dot,
        {
          backgroundColor
        }
      ]}
    />
  );
};

// The OnboardingScreen library is not able to test Done button.
// So ignore for now.
/* istanbul ignore next */
const Done = ({...props}) => (
  <TouchableOpacity testID="done" style={styles.button} {...props}>
    <Text style={styles.buttonText}>Done</Text>
  </TouchableOpacity>
);

const Skip = ({...props}) => (
  <TouchableOpacity testID="skip" style={styles.button} {...props}>
    <Text style={styles.buttonText}>Skip</Text>
  </TouchableOpacity>
);

const Next = ({...props}) => (
  <TouchableOpacity testID="next" style={styles.button} {...props}>
    <Text style={styles.buttonText}>Next</Text>
  </TouchableOpacity>
);

const OnboardingScreen = ({testID, navigation}) => {
  return (
    <Onboarding
      testID={testID || 'onboarding-screen'}
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Square}
      // Cannot test. Aaarg...
      onSkip={
        /* istanbul ignore next */
        () => navigation.jumpTo('App')
      }
      // Cannot test. Aaarg...
      onDone={
        /* istanbul ignore next */
        () => navigation.jumpTo('App')
      }
      imageContainerStyles={styles.imageContainerStyles}
      pages={[
        {
          backgroundColor: '#0F110C',
          image: (
            <LottieView
              source={require('../../resource/lottie/react-native-logo.json')}
              autoPlay
              loop
              resizeMode="cover"
              style={styles.image}
            />
          ),
          title: 'Connect to the World',
          subtitle: 'A New Way To Connect With The World'
        },
        {
          backgroundColor: '#2F2D2E',
          image: (
            <LottieView
              source={require('../../resource/lottie/react-native-logo.json')}
              autoPlay
              loop
              resizeMode="cover"
              style={styles.image}
            />
          ),
          title: 'Share Your Favorites',
          subtitle: 'Share Your Thoughts With Similar Kind of People'
        },
        {
          backgroundColor: '#001514',
          image: (
            <LottieView
              source={require('../../resource/lottie/react-native-logo.json')}
              autoPlay
              loop
              resizeMode="cover"
              style={styles.image}
            />
          ),
          title: 'Become The Star',
          subtitle: 'Let The Spot Light Capture You'
        }
      ]}
    />
  );
};
export default OnboardingScreen;

const styles = StyleSheet.create({
  imageContainerStyles: {height: 300},
  image: {
    width: 200
  },
  dot: {
    width: 6,
    height: 6,
    marginHorizontal: 3
  },
  button: {
    marginVertical: 10,
    width: 70,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18
  }
});
