import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function ButtonLink(props) {
  const {theme} = useTheme();
  const {testID, onPress, buttonStyle, text} = props;

  return (
    <TouchableOpacity testID={testID || 'button'} onPress={onPress}>
      <Text style={[styles.button, buttonStyle, {color: theme.color}]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    width: '100%',
    textAlignVertical: 'center',
    fontSize: 12,
    height: 30
  }
});
