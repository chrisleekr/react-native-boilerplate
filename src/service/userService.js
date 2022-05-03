import api from './api';

const me = async () => {
  return api.get('/me', {}).then(response => response.data);
};

const updateMe = async ({email, password, firstName, lastName}) => {
  return api
    .post('/me', {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    })
    .then(response => response.data);
};

export default {me, updateMe};
