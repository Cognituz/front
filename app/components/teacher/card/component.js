module.exports = {
  templateUrl: '/components/teacher/card/template.html',
  bindings: {
    teacher: '<',
    filters: '=',
  },
  controller: class {
    constructor($mdDialog, $mdMedia, AppointmentFormDialog) {
      'ngInject';
      this.$mdDialog             = $mdDialog;
      this.$mdMedia              = $mdMedia;
      this.AppointmentFormDialog = AppointmentFormDialog;
      this.lala = 5
    }
  }
};
