import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Formik} from 'formik';
import * as yup from 'yup';

import {useTheme} from '../../theme/useTheme';

import FormTextInputIcon from '../../component/form/textInputIcon';

import {addOne, list} from '../../store/slice/todoSlice';

const todoValidationSchema = yup.object().shape({
  name: yup.string().required('Todo is required.')
});

export default function TodoHeader({testID}) {
  const {theme} = useTheme();

  const {loading} = useSelector(state => state.todo);

  const dispatch = useDispatch();

  const onAdd = async ({name}, actions) => {
    dispatch(addOne({name, note: '', state: 'ongoing'})).then(result => {
      if (addOne.fulfilled.match(result)) {
        actions.resetForm({
          values: {
            name: ''
          }
        });
        dispatch(list());
      }
    });
  };

  return (
    <View
      testID={testID || 'todo-header'}
      style={[
        styles.headerContainer,
        {
          backgroundColor: theme.headerBg
        }
      ]}>
      <Text style={[styles.headerText, {color: theme.color}]}>
        What do you need to do?
      </Text>
      <Formik
        initialValues={{
          name: ''
        }}
        validationSchema={todoValidationSchema}
        onSubmit={onAdd}>
        {({handleSubmit}) => (
          <>
            <Field
              testID="name-input"
              component={FormTextInputIcon}
              name="name"
              iconName="plus"
              iconSize={30}
              containerStyle={styles.fieldContainer}
              textInputStyle={[
                styles.fieldInput,
                {backgroundColor: theme.color}
              ]}
              onPressIcon={handleSubmit}
              isLoading={loading !== 'idle'}
            />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 85,
    zIndex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerText: {
    fontSize: 13
  },
  fieldContainer: {
    marginTop: 5,
    marginHorizontal: 0
  },
  fieldInput: {
    borderWidth: 0,
    borderRadius: 5
  },
  refreshActivityIndicator: {
    position: 'absolute',
    zIndex: 1,
    top: 15,
    right: 15
  },
  refreshStyle: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
    right: 10,
    textAlignVertical: 'center'
  }
});
