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

  // Performs a RESTful member action
  // Default HTTP method is PUT
  $delegate.prototype.performAction = function(action, queryParams = {}) {
    const url = this.$url(action);
    return this.$put(url, this, queryParams);
  };

  // Just alias
  $delegate.prototype.perform = $delegate.prototype.performAction;

  // Just an alias for perform('trasition/eventName')
  $delegate.prototype.transition = function(eventName) {
    return this.performAction(`transition`, {event: eventName});
  };

  // Depends on API exposing an attribute availableStatusTransitions
  $delegate.prototype.isTransitionAvailable = function(eventName) {
    return this.availableStatusTransitions.indexOf(eventName) !== -1;
  };

  return $delegate;
};
