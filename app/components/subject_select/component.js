const Fuse = require('fuse.js');

module.exports = {
  templateUrl: '/components/subject_select/template.html',
  bindings: {
    subjectGroups: '=?',
    outsideModel:  '<ngModel',
    required:      '<?'
  },
  require: {ngModel: 'ngModel'},
  controller: class {
    constructor($element, $timeout, $scope, SubjectGroup) {
      this.$element     = $element;
      this.$timeout     = $timeout;
      this.$scope       = $scope;
      this.SubjectGroup = SubjectGroup;

      this.containerClass = `ctz-select-container_${new Date().getTime()}`;
    }

    $onInit() {
      this.$scope.$watch(_ => this.model, m => this.ngModel.$setViewValue(m));
      this.ngModel.$render = _ => this.model = this.ngModel.$modelValue;

      if (!this.subjectGroups)
        this.SubjectGroup.query()
          .then(sgs => this.subjectGroups = sgs);
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
