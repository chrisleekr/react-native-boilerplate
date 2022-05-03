import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '../../theme/useTheme';

export default function FormTextInputIcon(props) {
  const {theme} = useTheme();

  const {
    testID,
    containerStyle,
    textInputStyle,
    iconName,
    iconSize,
    iconStyle,
    onPressIcon,
    isLoading,
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched},
    ...inputProps
  } = props;

  const handleBlur = controlName => {
    setFieldTouched(controlName);
    onBlur(controlName);
  };

  const hasError = errors[name] && touched[name];

  return (
    <View
      testID={testID || 'text-input-icon'}
      style={[styles.container, containerStyle]}>
      <TextInput
        testID="input"
        style={[
          styles.textInput,
          textInputStyle,
          hasError && styles.errorInput,
          {backgroundColor: theme.cardBg}
        ]}
        value={value}
        onChangeText={text => onChange(name)(text)}
        onBlur={() => handleBlur(name)}
        {...inputProps}
      />

      {isLoading ? (
        <View testID="activity-indicator" style={[styles.activityIndicator]}>
          <ActivityIndicator color={theme.buttonDisabledColor} />
        </View>
      ) : (
        <TouchableOpacity
          testID="icon"
          style={[styles.icon, iconStyle]}
          onPress={onPressIcon}>
          <Icon name={iconName} size={iconSize} color={theme.color} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  textInput: {
    width: '100%',
    height: 35,
    borderWidth: 1,
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0
  },
  errorInput: {
    borderWidth: 1,
    borderColor: 'red'
  },
  activityIndicator: {
    position: 'absolute',
    zIndex: 1,
    top: 8,
    right: 5
  },
  icon: {
    position: 'absolute',
    zIndex: 1,
    top: 2,
    right: 0,
    textAlignVertical: 'center'
  }
});
