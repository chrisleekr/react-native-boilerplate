import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

import Layout from '../../component/layout';
import SamplePage1Screen from './page1';
import SamplePage2Screen from './page2';

const routesMap = [
  {
    key: 'samplePage1',
    title: 'Sample Page 1'
  },
  {
    key: 'samplePage2',
    title: 'Sample Page 2'
  }
];

const renderScene = SceneMap({
  samplePage1: SamplePage1Screen,
  samplePage2: SamplePage2Screen
});

export default function SamplePageScreen({testID}) {
  const [index, onIndexChange] = useState(0);
  const [routes] = useState(routesMap);

  const renderTabBar = useCallback(
    props => (
      <TabBar
        testID="tab-bar"
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        labelStyle={styles.label}
        tabStyle={styles.tabStyle}
      />
    ),
    []
  );

  return (
    <Layout testID={testID || 'sample-page-screen'}>
      <TabView
        testID="tab-view"
        lazy
        navigationState={{
          index,
          routes
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={onIndexChange}
        offscreenPageLimit={2}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#3f51b5'
  },
  indicator: {
    backgroundColor: '#ffeb3b'
  },
  label: {
    fontWeight: '400'
  },
  tabStyle: {
    width: 'auto'
  }
});
