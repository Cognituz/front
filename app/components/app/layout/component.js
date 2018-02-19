module.exports = {
  templateUrl: '/components/app/layout/template.html',
  controller: class {
    constructor($state, $mdToast, Auth, ClassAppointment) {
      'ngInject';
      this.$mdToast = $mdToast;
      this.$state   = $state;
      this.Auth     = Auth;
      this.ClassAppointment = ClassAppointment

      Auth.getCurrentUser().then(u => {
        this.user = u;
        const userType = this.user.isTeacher ? 'teacher' : 'student';
        this.filters = {[`${userType}_id`]: this.user.id};
        this.getClassAppointments()
      });
    }

    getClassAppointments() {
      this.ClassAppointment
        .query({filters: this.filters})
        .then(cas => this.live = cas.filter(appointment => appointment.status == 'live'));
    }

    logout() {
      this.Auth
        .logout()
        .then(_ => this.redirectToHome());
    }

    redirectToHome() {
      this.$state.go('home')
        .then(_ => this.$mdToast.showSimple('¡Hasta la próxima!'))
    }
  }
};
