import React, {useCallback, useEffect} from 'react';
import {View, Text, ScrollView, RefreshControl, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import {useTheme} from '../../theme/useTheme';

import Layout from '../../component/layout';
import {
  deleteOne,
  list,
  resetErrors,
  updateOne
} from '../../store/slice/todoSlice';

import TodoCard from '../../component/list/todoCard';
import TodoHeader from './header';

export default function TodoScreen({testID}) {
  const {theme} = useTheme();

  const {isAuthenticated} = useSelector(state => state.auth);
  const {loading, todoOngoing, todoCompleted} = useSelector(
    state => state.todo
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(resetErrors());
    }, [dispatch])
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(list());
    }
  }, [dispatch, isAuthenticated]);

  const onUpdate = async ({state, todo}) => {
    dispatch(updateOne({todo: {...todo, state}})).then(result => {
      if (updateOne.fulfilled.match(result)) {
        dispatch(list());
      }
    });
  };

  const onRemove = async ({state, todo}) => {
    dispatch(deleteOne({todo: {...todo, state}})).then(result => {
      if (deleteOne.fulfilled.match(result)) {
        dispatch(list());
      }
    });
  };

  const onRefresh = useCallback(() => {
    dispatch(list());
  }, [dispatch]);

  if (isAuthenticated === false) {
    return (
      <Layout
        testID={testID || 'todo-not-auth'}
        style={styles.containerNotLoggedIn}>
        <View style={styles.logoContainer}>
          <LottieView
            source={require('../../resource/lottie/react-native-logo.json')}
            autoPlay
            loop
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <Text testID="title" style={[styles.header, {color: theme.color}]}>
          You are not logged in.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout testID={testID || 'todo-screen'} style={styles.container}>
      <TodoHeader testID="todo-header" />

      <ScrollView
        testID="scroll-view"
        refreshControl={
          <RefreshControl
            testID="refresh-control"
            refreshing={loading !== 'idle'}
            onRefresh={onRefresh}
          />
        }
        style={[
          styles.todoContainer,
          {
            backgroundColor: theme.layoutBg
          }
        ]}>
        {todoOngoing.length === 0 && todoCompleted.length === 0 ? (
          <View
            testID="no-list"
            style={[
              styles.noListText,
              {
                color: theme.buttonDisabledColor
              }
            ]}>
            Please add new todo.
          </View>
        ) : null}
        {todoOngoing.length > 0
          ? todoOngoing.map((todo, index) => (
              <TodoCard
                testID={`todo-ongoing-${todo.id}`}
                key={`todo-ongoing-${index}`}
                loading={loading !== 'idle'}
                leftIconOnPress={() => onUpdate({state: 'completed', todo})}
                leftIconName="checkbox-blank-circle-outline"
                leftIconSize={20}
                leftIconColor={theme.color}
                todo={todo}
                rightIconOnPress={() => onRemove({todo})}
                rightIconName="trash-can-outline"
                rightIconSize={20}
                rightIconColor={theme.error}
              />
            ))
          : null}
        {todoCompleted.length > 0
          ? todoCompleted.map((todo, index) => (
              <TodoCard
                testID={`todo-completed-${todo.id}`}
                key={`todo-completed-${index}`}
                loading={loading !== 'idle'}
                leftIconOnPress={() => onUpdate({state: 'ongoing', todo})}
                leftIconName="checkbox-marked-circle"
                leftIconSize={20}
                leftIconColor={theme.color}
                todo={todo}
                rightIconOnPress={() => onRemove({todo})}
                rightIconName="trash-can-outline"
                rightIconSize={20}
                rightIconColor={theme.error}
              />
            ))
          : null}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerNotLoggedIn: {
    flex: 1,
    flexDirection: 'column',
    padding: 10
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginBottom: 10
  },
  header: {
    width: '100%',
    textAlign: 'center',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10
  },
  todoContainer: {
    flex: 1,
    marginTop: 0,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  noListText: {
    fontSize: 15
  }
});
