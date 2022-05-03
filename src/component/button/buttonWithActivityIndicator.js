import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function ButtonWithActivityIndicator(props) {
  const {theme} = useTheme();
  const {testID, onPress, buttonStyle, textStyle, isLoading, text, disabled} =
    props;
  return (
    <TouchableOpacity
      testID={testID || 'button'}
      onPress={onPress}
      style={[
        styles.buttonContainer,
        buttonStyle,
        {
          backgroundColor:
            disabled === false && isLoading === false
              ? theme.buttonActiveColor
              : theme.buttonDisabledColor
        }
      ]}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <View testID="activity-indicator" style={[styles.activityIndicator]}>
          <ActivityIndicator color={theme.invertColor} />
        </View>
      ) : null}
      <Text
        style={[
          textStyle,
          {
            color: isLoading === false ? theme.invertColor : theme.color
          }
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
    height: 44,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10
  },
  activityIndicator: {
    marginRight: 5
  }
});
