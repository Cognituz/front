module.exports = {
  templateUrl: '/components/teacher/list/filters/template.html',
  controller: class {
    constructor($q) {
      this.levels = {
        primary: 'Primario',
        secondary: 'Secundario',
        terciary: 'Terciario/Universitario'
      };

      this.filters = angular.extend({}, this.filters || {}, {
        subjects: []
      });

      this.subjects = [
        'Matemática',
        'Lengua'
      ];
    }
  }
};
