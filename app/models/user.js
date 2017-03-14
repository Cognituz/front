module.exports = (
  RailsResource,
  railsSerializer
) => {
  'ngInject';

  class User extends RailsResource {
    static get SCHOOL_YEARS() {
      return [
        "1er. Grado",
        "2do. Grado",
        "3ro. Grado",
        "4to. Grado",
        "5to. Grado",
        "6to. Grado",
        "7mo. Grado",
        "8vo. Grado",
        "9no. Grado",
        "1er. Año",
        "2do. Año",
        "3ro. Año",
        "4to. Año",
        "5to. Año"
      ];
    }
  };

  User.configure({
    url:  'http://localhost:3000/v1/users',
    name: 'user'
  });

  return User;
};
