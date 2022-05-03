import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Axios
import setupInterceptors from '../service/setupInterceptors';

// Slices
import authReducer from './slice/authSlice';
import todoReducer from './slice/todoSlice';
import userReducer from './slice/userSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage
};

const rootReducer = combineReducers({
  auth: authReducer,
  todo: todoReducer,
  user: userReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // middleware option needs to be provided for avoiding the error. ref: https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Since axios is throwing serializecheck error, so had to turn off.
      // serializableCheck: false
      // But let see how it goes with following list instead of turnning it off.
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'auth/login/rejected',
          'auth/register/rejected',
          'auth/passwordResetRequest/rejected',
          'todo/list/rejected',
          'todo/addOne/rejected',
          'todo/updateOne/rejected',
          'todo/deleteOne/rejected',
          'user/me/rejected',
          'user/updateMe/rejected'
        ]
      }
    })
});

setupInterceptors(store);

export const persistor = persistStore(store);
export default store;
