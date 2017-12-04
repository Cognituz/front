module.exports = {
  templateUrl: '/components/teacher/list/filters/template.html',
  require: {ngModel: 'ngModel'},
  controller: class {
    constructor($scope) {
      'ngInject';

      $scope.$watch(
        _ => this.filters,
        fts => this.ngModel.$setViewValue(fts),
        true
      );

      this.input = document.getElementById('searchInput');
      var autocomplete = new google.maps.places.Autocomplete(this.input);
    }

    $onInit() {
      console.log(this.ngModel)
      const filters = this.ngModel.$modelValue || {};
      this.ngModel.$setViewValue(filters);
      this.ngModel.$render = _ => this.filters = this.ngModel.$viewValue;
    }

    setMetaLevel() {
      this.$level = this.subjectGroups.find(sg => sg.name == this.level);
    }
  }
};
