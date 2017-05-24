module.exports = ($mdDialog) => {
  'ngInject';

  return new class AppointmentFormDialog {
    show(teacher, targetEvent) {
      $mdDialog.show({
        targetEvent,
        template: `
          <md-dialog class='ctz-teacher-reservation-dialog'>
            <ctz-appointment-form teacher="$ctrl.teacher" layout-fill/>
          </md-dialog>
        `,
        clickOutsideToClose: true,
        locals: {teacher}
      });
    }
  };
};
