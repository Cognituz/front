module.exports = {
  templateUrl: '/components/select/template.html',
  bindings: {
    multiple:   '<',
    searchTerm: '=bindSearchTermTo',
    searchPlaceholder: '@?'
  },
  transclude: true,
  require: {ngModel: 'ngModel'},
  controller: class {
    constructor($element, $timeout, $scope) {
      this.$element = $element;
      this.$timeout = $timeout;
      this.$scope   = $scope;

      this.containerClass = `ctz-select-container_${new Date().getTime()}`;
    }

    $onInit() {
      this.$scope.$watch(_ => this.model, m => this.ngModel.$setViewValue(m));
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
