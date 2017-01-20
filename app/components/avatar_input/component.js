module.exports = {
  templateUrl: '/components/avatar_input/template.html',
  require: {ngModel: 'ngModel'},
  controller: class {
    $onInit() {
      this.ngModel.render =
        _ => this.avatar = this.$ngModel.$modelValue;
    };
  }
};
