import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme/useTheme';

export default function TodoCard(props) {
  const {theme} = useTheme();

  const {
    testID,
    loading,
    leftIconOnPress,
    leftIconName,
    leftIconSize,
    leftIconColor,
    todo,
    rightIconOnPress,
    rightIconName,
    rightIconSize,
    rightIconColor
  } = props;

  return (
    <View
      testID={testID || 'todo-card'}
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBg,
          shadowColor: theme.card.shadowColor
        }
      ]}>
      <TouchableOpacity
        testID="left-icon"
        style={styles.leftIcon}
        onPress={leftIconOnPress}
        disabled={loading}>
        <Icon name={leftIconName} size={leftIconSize} color={leftIconColor} />
      </TouchableOpacity>

      <Text
        testID="text"
        style={[
          styles.text,
          {
            color: todo.state === 'completed' ? theme.labelColor : theme.color
          },
          todo.state === 'completed' ? styles.textCompleted : {}
        ]}>
        {todo.name}
      </Text>

      <TouchableOpacity
        testID="right-icon"
        onPress={rightIconOnPress}
        disabled={loading}>
        <Icon
          name={rightIconName}
          size={rightIconSize}
          color={rightIconColor}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  leftIcon: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 25
  },
  text: {
    fontSize: 15,
    flexGrow: 1,
    flexShrink: 0
  },
  textCompleted: {
    textDecorationLine: 'line-through'
  }
});
