import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function ErrorText(props) {
  const {theme} = useTheme();
  const {testID, textStyle, text} = props;

  return (
    <Text
      testID={testID || 'error-text'}
      style={[styles.text, textStyle, {color: theme.errorText}]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    marginBottom: 10
  }
});
