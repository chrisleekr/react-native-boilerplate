import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme/useTheme';

export default function BackButton({testID, goBack}) {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      testID={testID || 'button'}
      onPress={goBack}
      style={styles.container}>
      <Icon name="arrow-left-thin" size={25} color={theme.color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 4
  },
  image: {
    width: 24,
    height: 24
  }
});
