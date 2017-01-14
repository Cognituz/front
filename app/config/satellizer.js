module.exports = $authProvider => {
  'ngInject';

  $authProvider.baseUrl = 'http://localhost:3000/v1';
  $authProvider.facebook({clientId: '1488551384779862'});
};
