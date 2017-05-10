const {API_URL} = require('config');

module.exports = (RailsResource) => {
  'ngInject';

  class Neighborhood extends RailsResource {}

  Neighborhood.configure({
    url:  `${API_URL}/v1/neighborhoods`,
    name: 'neighborhoods'
  });

  return Neighborhood;
};
