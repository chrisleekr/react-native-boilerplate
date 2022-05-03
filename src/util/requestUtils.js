import _ from 'lodash';

const getErrorMessages = payload => {
  const {status, data: responseData} = payload || {};

  const {data} = responseData || {};

  let errorMessages = [];
  if (status === 422) {
    errorMessages = _.reduce(
      data,
      (newErrorMessages, tmpData) => {
        newErrorMessages.push(tmpData.msg);
        return newErrorMessages;
      },
      []
    );
  } else {
    errorMessages.push('Request error occurred.');
  }

  return errorMessages;
};

export {getErrorMessages};
