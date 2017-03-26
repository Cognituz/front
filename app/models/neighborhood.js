module.exports = (RailsResource) => {
  'ngInject';

  class Neighborhood extends RailsResource {}

  Neighborhood.configure({
    url:  'http://localhost:3000/v1/neighborhoods',
    name: 'neighborhoods'
  });

  return Neighborhood;
};
