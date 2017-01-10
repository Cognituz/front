module.exports = (AuthProvider) => {
  'ngInject';
  AuthProvider.baseUrl('http://localhost:3000/v1');
  AuthProvider.loginMethod('POST');
};
