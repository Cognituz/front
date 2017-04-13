// Override how AngularJS uses $http so it deep encodes query strings
const humps = require('humps');
const qs    = require('qs');

module.exports = $delegate => {
  'ngInject';

  $delegate.$get = function(url, queryParams) {
    const config = angular.extend({method: 'get', url: url}, this.getHttpConfig(queryParams));

    if (angular.isObject(config.params)) {
      if (this.config.underscoreParams) config.params = humps.decamelizeKeys(config.params);
      const queryString = qs.stringify(config.params, {arrayFormat: 'brackets', encode: false});
      config.url += '?' + queryString;
      delete config.params
    }

    return this.$http(config);
  };

  return $delegate;
};
