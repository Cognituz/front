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

      this.filters = {page: 0};

      this.search();
    }

    search({append} = {}) {
      const filters = angular.extend({isTeacher: true}, this.filters)
      if (this.filters.classType === 'online') filters.teachesOnline = true;

      this.User
        .query({filters: filters})
        .then(resp => {
          this.totalPages = resp.pagination.totalPages;

          if (append)
            this.teachers = this.teachers.concat(resp.data);
          else
            this.teachers = resp.data
        });
    }

    clearFilters() {
      this.filters = {};
      this.search();
    }

    get getNextPage() {
      this.filters = this.filters || {}
      this.filters.page = this.filters.page || 0;
      this.filters.page++;
      this.search({append: true})
    }

    shouldGetNextPage() {
      return this.filters && !(this.filters.page >= this.totalPages - 1);
    }
  }
};
