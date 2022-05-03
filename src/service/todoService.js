import api from './api';

const list = async () => {
  return api
    .get('/todo', {order_by: 'updated_at_desc'})
    .then(response => response.data);
};

const postOne = async ({name, note, state}) => {
  return api.post('/todo', {name, note, state}).then(response => response.data);
};

const patchOne = async ({id, name, note, state}) => {
  return api
    .patch(`/todo/${id}`, {name, note, state})
    .then(response => response.data);
};

const deleteOne = async ({id}) => {
  return api.delete(`/todo/${id}`).then(response => response.data);
};

export default {list, postOne, patchOne, deleteOne};
