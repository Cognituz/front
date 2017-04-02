module.exports = {
  templateUrl: '/components/teacher/list/filters/template.html',
  require: {ngModel: 'ngModel'},
  controller: class {
    constructor($scope, Neighborhood, SubjectGroup) {
      $scope.$watch(_ => this.filters, fts => this.ngModel.$setViewValue(fts), true);

      Neighborhood.query().then(ngs => this.neighborhoods = ngs);
    }

    $onInit() {
      const filters = this.ngModel.$modelValue || {};
      this.ngModel.$setViewValue(filters);
    }

    setMetaLevel() {
      this.$level = this.subjectGroups.find(sg => sg.name == this.level);
    }
  }
};
