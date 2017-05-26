module.exports = {
  templateUrl: '/components/appointment/card/template.html',
  bindings: {
    appointment: '=',
    userType:    '='
  },
  controller: class {
    get displayedUser() {
      const userToDisplay =
        this.userType === 'teacher' ? 'student' : 'teacher';

      return this.appointment[userToDisplay];
    }

    cancel() { this.appointment.transition('cancel'); }
  }
};
