import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/useTheme';

const Layout = ({testID, children, style}) => {
  const {theme} = useTheme();

  return (
    <SafeAreaView
      testID={testID || 'layout'}
      style={[styles.layout, {backgroundColor: theme.layoutBg}, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1
  }
});

export default Layout;
