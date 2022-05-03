module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-unused-vars': ['error', {argsIgnorePattern: '^_'}]
  }
};
