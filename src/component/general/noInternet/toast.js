import React from 'react';
import {StyleSheet, Dimensions, Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

// Component (tiny) for showing No Intenet message at bottom the app
export default function NoInternetToast({testID}) {
  const netInfo = useNetInfo();
  if (!netInfo.isConnected) {
    return (
      <View
        testID={testID || 'no-internet-toast'}
        style={styles.offlineContainer}>
        <Text testID="text" style={styles.offlineText}>
          No Internet Connection
        </Text>
      </View>
    );
  }
  return null;
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#d70015',
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    bottom: 0,
    zIndex: 10
  },
  offlineText: {fontSize: 11, color: '#fff'}
});
