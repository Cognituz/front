module.exports = (RailsResource) => {
  'ngInject';

  class User extends RailsResource {};

  User.configure({
    url:  'http://localhost:3000/v1/users',
    name: 'user'
  });

  return User;
};
