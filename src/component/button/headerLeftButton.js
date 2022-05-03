import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme/useTheme';

export default function HeaderLeftButton({testID, navigation}) {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      testID={testID || 'button'}
      onPress={() => navigation.toggleDrawer()}
      style={styles.headerLeft}>
      <Icon name="menu" size={25} color={theme.color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: -5,
    marginRight: 10
  }
});
