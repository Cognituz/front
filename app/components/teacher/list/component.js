module.exports = {
  templateUrl: '/components/teacher/list/template.html',
  controller: class {
    constructor(
      Neighborhood,
      SubjectGroup,
      User
    ) {
      'ngInject';

      this.User    = User;

      Neighborhood.query().then(ngs => this.neighborhoods = ngs);
      SubjectGroup.query().then(sgs => this.subjectGroups = sgs);

      this.filters = {};

      this.search();
    }

    search() {
      const filters = angular.extend({isTeacher: true}, this.filters)
      if (this.filters.classType === 'online') filters.teachesOnline = true;

      this.User
        .query({filters: filters})
        .then(users => this.teachers = users);
    }

    clearFilters() {
      this.filters = {};
      this.search();
    }
  }
};
