module.exports = {
  templateUrl: '/components/appointment/form/template.html',
  bindings: {teacher: '<'},
  controller: class {
    constructor($mdMedia, $mdDialog) {
      'ngInject';
      this.$mdDialog = $mdDialog;
      this.$mdMedia  = $mdMedia;
    }

    close() { this.$mdDialog.hide(); }
  }
};
