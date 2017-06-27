const _ = require('lodash');

module.exports = {
  templateUrl: '/components/subject_select/template.html',
  bindings: {
    outsideModel:  '<ngModel',
    required:      '<?',

    // to be able to select from a different list of subjects,
    // like the taught subjects list of a teacher
    studySubjects: '=?'
  },
  require: {ngModel: 'ngModel'},
  controller: class {
    constructor($element, $timeout, $scope, StudySubject) {
      'ngInject';

      this.$element     = $element;
      this.$timeout     = $timeout;
      this.$scope       = $scope;
      this.StudySubject = StudySubject;

      this.containerClass = `ctz-select-container_${new Date().getTime()}`;
    }

    $onInit() {
      this.$scope.$watch(_ => this.model, m => this.ngModel.$setViewValue(m));
      this.ngModel.$render = _ => this.model = this.ngModel.$modelValue;

      if (this.studySubjects)
        this.studySubjects = _.groupBy(this.studySubjects, 'level')
      else
        this.StudySubject.query()
          .then(sss => this.studySubjects = _.groupBy(sss, 'level'));
    }

    get $input() { return $(`.${this.containerClass}`).find('input'); }

    onOpen() {
      this.$timeout(_ => {
        this.$input.keydown(ev => ev.stopPropagation());
        this.$input.focus();
      }, 300);
    }

    clearSearch() { delete this.searchTerm; }
  }
};
