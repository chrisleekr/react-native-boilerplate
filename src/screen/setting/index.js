import React from 'react';
import {Text, StyleSheet, View, ScrollView, Switch} from 'react-native';

import Layout from '../../component/layout';
import {useTheme} from '../../theme/useTheme';

import BackButton from '../../component/button/backButton';

export default function SettingScreen({testID, navigation}) {
  const {theme, toggleTheme} = useTheme();

  const onToggleTheme = value => {
    toggleTheme(value);
  };

  return (
    <Layout testID={testID || 'setting-screen'} style={styles.container}>
      <BackButton testID="back-button" goBack={navigation.goBack} />
      <View style={styles.screenContainer}>
        <Text style={[styles.header, {color: theme.color}]}>Settings</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={true}>
          <View style={[styles.itemContainer, {backgroundColor: theme.cardBg}]}>
            <Text
              testID="dark-mode-label"
              style={[
                styles.itemText,
                {
                  color: theme.labelColor
                }
              ]}>
              Dark mode
            </Text>
            <Switch
              testID="dark-mode-switch"
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={theme.name === 'dark' ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => onToggleTheme(value)}
              value={theme.name === 'dark'}
            />
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10
  },
  screenContainer: {
    marginTop: 25
  },
  header: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5
  },
  itemText: {
    fontSize: 15
  }
});
