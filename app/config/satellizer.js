const {API_URL, FACEBOOK_ID} = require('config');

module.exports = $authProvider => {
  'ngInject';

  $authProvider.baseUrl = `${API_URL}/v1`;
  $authProvider.facebook({clientId: FACEBOOK_ID});
};
