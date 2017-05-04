module.exports = ($mdDialog) => {
  'ngInject';

  return new class TeacherReservationDialog {
    show(teacher) {
      $mdDialog.show({
        template: `
          <md-dialog class='ctz-teacher-reservation-dialog'>
            <ctz-appointment-form teacher="$ctrl.teacher" layout-fill/>
          </md-dialog>
        `,
        locals: {teacher}
      });
    }
  };
};
