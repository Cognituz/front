const {API_URL} = require('config');

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
    url:  `${API_URL}:3000/v1/users`,
    name: 'user',
    serializer: railsSerializer(function() {
      this.nestedAttribute('taughtSubjects');
      this.nestedAttribute('location');
      this.nestedAttribute('availabilityPeriods');
    })
  });

  User.interceptResponse((response, constructor, context) => {
    const totalRecords   = parseHeaderAsInt('X-Total-Records');
    const recordsPerPage = parseHeaderAsInt('X-Records-Per-Page');

    const totalPages =
      totalRecords &&
      recordsPerPage &&
      Math.ceil(totalRecords / recordsPerPage);

    response.data.$pagination = {totalRecords, recordsPerPage, totalPages};

    function parseHeaderAsInt(headerName) {
      const val = response.headers(headerName);
      return val && parseInt(val);
    }

    return response;
  });

  return User;
};
