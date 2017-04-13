module.exports = {
  templateUrl: '/components/teacher/list/template.html',
  controller: class {
    constructor(
      $mdMedia,
      $mdSidenav,
      User
    ) {
      'ngInject';

      this.$mdMedia   = $mdMedia;
      this.$mdSidenav = $mdSidenav;
      this.User       = User;

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

          if (!this.$mdMedia('gt-sm')) this.sidenav.close();
        });
    }

    clearFilters() {
      this.filters = {};
      this.search();
    }

    getNextPage() {
      this.page = this.page || 0;
      this.page++;
      this.search({append: true})
    }

    get sidenav() { return this.$mdSidenav('teacherFilters'); }

    shouldGetNextPage() { return !(this.page >= this.totalPages); }
  }
};
