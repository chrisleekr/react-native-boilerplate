import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function LabelText(props) {
  const {theme} = useTheme();
  const {testID, containerStyle, labelStyle, label, textStyle, text} = props;

  return (
    <View
      testID={testID || 'label-text'}
      style={[styles.container, containerStyle]}>
      <Text
        testID={'label'}
        style={[styles.label, labelStyle, {color: theme.labelColor}]}>
        {label}
      </Text>
      <Text
        testID={'text'}
        style={[styles.text, textStyle, {color: theme.color}]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  label: {
    fontSize: 16
  },
  text: {
    width: '100%',
    height: 23
  }
});
