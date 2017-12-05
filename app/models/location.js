const {API_URL} = require('config');

module.exports = (RailsResource) => {
  'ngInject';

  class Location extends RailsResource {}

  Location.configure({
    url:  `${API_URL}/v1/locations`,
    name: 'location'
  });

  return Location;
};
