import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {useDispatch} from 'react-redux';

import Layout from '../../component/layout';
import {logout} from '../../store/slice/authSlice';

export default function LogoutScreen({testID}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <Layout testID={testID || 'logout-screen'}>
      <Text>You have been logged out successfully.</Text>
    </Layout>
  );
}
