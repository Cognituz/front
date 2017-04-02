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

      this.page    = 1;
      this.filters = {};

      this.search();
    }

    search({append} = {}) {
      const filters = angular.extend({isTeacher: true}, this.filters || {})
      if (filters.classType === 'online') filters.teachesOnline = true;

      this.User
        .query({page: this.page, filters: filters})
        .then(users => {
          this.totalPages = users.$pagination.totalPages;

          if (append) this.teachers = this.teachers.concat(users);
          else this.teachers = users;
        });
    }

    clearFilters() {
      this.filters = {};
      this.search();
    }

    get getNextPage() {
      this.page = this.page || 0;
      this.page++;
      this.search({append: true})
    }

    shouldGetNextPage() {
      return !(this.page >= this.totalPages);
    }
  }
};
