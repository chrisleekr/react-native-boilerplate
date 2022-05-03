import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme/useTheme';

export default function HeaderRightButton({testID, navigation}) {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      testID={testID || 'button'}
      onPress={() => navigation.navigate('Settings')}
      style={styles.headerRight}>
      <Icon name="cog" size={25} color={theme.color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginLeft: 0,
    marginRight: -5
  }
});
