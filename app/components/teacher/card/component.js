module.exports = {
  templateUrl: '/components/teacher/card/template.html',
  bindings: {teacher: '<'},
  controller: class {
    constructor($mdDialog, $mdMedia, AppointmentFormDialog) {
      'ngInject';
      this.$mdDialog             = $mdDialog;
      this.$mdMedia              = $mdMedia;
      this.AppointmentFormDialog = AppointmentFormDialog;
    }
  }
};
