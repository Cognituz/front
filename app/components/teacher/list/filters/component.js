module.exports = {
  templateUrl: '/components/teacher/list/filters/template.html',
  require: {ngModel: 'ngModel'},
  controller: class {
    constructor($scope, Neighborhood) {
      'ngInject';

      $scope.$watch(
        _ => this.filters,
        fts => this.ngModel.$setViewValue(fts),
        true
      );

      Neighborhood.query().then(ngs => this.neighborhoods = ngs);
    }

    $onInit() {
      const filters = this.ngModel.$modelValue || {};
      this.ngModel.$setViewValue(filters);
      this.ngModel.$render = _ => this.filters = this.ngModel.$viewValue;
    }

    setMetaLevel() {
      this.$level = this.subjectGroups.find(sg => sg.name == this.level);
    }
  }
};
