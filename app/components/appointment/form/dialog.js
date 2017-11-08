module.exports = ($mdDialog) => {
  'ngInject';

  return new class AppointmentFormDialog {
    show(teacher, targetEvent, filters) {
      console.log(filters)
      console.log(targetEvent)
      console.log(teacher)
      $mdDialog.show({
        targetEvent,
        template: `
          <md-dialog class='ctz-teacher-reservation-dialog'>
            <ctz-appointment-form
              teacher="$ctrl.teacher"
              filters="$ctrl.filters"
              layout-fill
            />
          </md-dialog>
        `,
        clickOutsideToClose: true,
        locals: {teacher, filters}
      });
    }
  };
};
