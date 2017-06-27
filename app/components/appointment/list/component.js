module.exports = {
  templateUrl: '/components/appointment/list/template.html',
  controller: class {
    constructor(Auth, ClassAppointment) {
      'ngInject';

      this.statuses = {
        unconfirmed: 'No confirmada',
        confirmed:   'Confirmada',
        live:        'En vivo',
        expired:     'Expirada',
        cancelled:   'Cancelada'
      };

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
        .then(cas => this.appointments = cas);
    }
  }
};
