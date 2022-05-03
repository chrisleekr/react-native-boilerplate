import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import Layout from '../../layout';

import {useTheme} from '../../../theme/useTheme';

// Full Screen component to show No internet message
export default function NoInternet({testID}) {
  const netInfo = useNetInfo();

  const {theme} = useTheme();
  if (!netInfo.isConnected) {
    return (
      <Layout testID={testID || 'no-internet-toast'}>
        <Text testID="text" style={[styles.title, {color: theme.color}]}>
          No Internet
        </Text>
        <Text style={{color: theme.color}}>Please check your connection</Text>
      </Layout>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 10
  }
});
