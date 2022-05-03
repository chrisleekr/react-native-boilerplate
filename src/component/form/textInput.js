import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Animated} from 'react-native';

import {useTheme} from '../../theme/useTheme';

export default function FormTextInput(props) {
  const {theme} = useTheme();

  const {
    testID,
    label,
    textInputStyle,
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched},
    ...inputProps
  } = props;

  const animatedIsFocused = useRef(new Animated.Value(0)).current;

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = controlName => {
    setIsFocused(false);
    setFieldTouched(controlName);
    onBlur(controlName);
  };

  Animated.timing(animatedIsFocused, {
    toValue: isFocused || value !== '' ? 1 : 0,
    duration: 200,
    useNativeDriver: false
  }).start();

  const hasError = errors[name] && touched[name];

  return (
    <View testID={testID || 'text-input'} style={styles.container}>
      <Animated.Text
        testID="label"
        style={[
          styles.label,
          {
            top: animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [18, 0]
            }),
            fontSize: animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 14]
            }),
            color: animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: ['#aaa', '#000']
            })
          },
          {color: theme.labelColor}
        ]}>
        {label}
      </Animated.Text>
      <TextInput
        testID="input"
        style={[
          styles.textInput,
          textInputStyle,
          {color: theme.color},
          hasError && styles.errorInput
        ]}
        value={value}
        onChangeText={text => onChange(name)(text)}
        onFocus={handleFocus}
        onBlur={() => handleBlur(name)}
        {...inputProps}
      />
      {hasError && (
        <Text testID="errors" style={styles.errorText}>
          {errors[name]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18
  },
  label: {
    position: 'absolute',
    left: 0
  },
  textInput: {
    width: '100%',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    marginBottom: 10
  },
  errorInput: {
    borderColor: 'red'
  }
});
