import api from './api';

const login = async ({username, password}) => {
  return api
    .post('/user/login', {
      username,
      password
    })
    .then(response => response.data);
};

const register = async ({email, username, password, firstName, lastName}) => {
  return api
    .post('/user/register', {
      email,
      username,
      password,
      first_name: firstName,
      last_name: lastName
    })
    .then(response => response.data);
};

const passwordResetRequest = async ({email}) => {
  return api
    .post('/user/password-reset-request', {
      email
    })
    .then(response => response.data);
};

export default {login, register, passwordResetRequest};
