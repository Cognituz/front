module.exports = {
  templateUrl: '/components/teacher/card/template.html',
  bindings: {teacher: '<'},
  controller: class {
    constructor($mdDialog, $mdMedia) {
      'ngInject';
      this.$mdDialog = $mdDialog;
      this.$mdMedia  = $mdMedia;
    }

    showTeacherReservationDialog(teacher) {
      this.$mdDialog.show({
        template: `
          <md-dialog>
            <ctz-teacher-reservation-form teacher="$ctrl.teacher" layout-fill/>
          </md-dialog>
        `,
        locals: {teacher},
        fullscreen: this.$mdMedia('xs')
      });
    }
  }
};
