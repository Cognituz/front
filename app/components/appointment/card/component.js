module.exports = {
  templateUrl: '/components/appointment/card/template.html',
  bindings: {
    appointment: '=',
    userType:    '='
  },
  controller: class {
    constructor() {
      this.statuses = {
        'unconfirmed': 'No confirmada',
        'confirmed':   'Confirmada',
        'live':        'En vivo',
        'expired':     'Expirada',
        'cancelled':   'Cancelada'
      };

      this.kinds = {
        'at_public_place': 'Publica',
        'online':          'Online',
      };
    }

    get displayedUser() {
      const userToDisplay =
        this.userType === 'teacher' ? 'student' : 'teacher';

      return this.appointment[userToDisplay];
    }

    cancel() { this.appointment.transition('cancel'); }
    confirm() { this.appointment.transition('confirm'); }
  }
};
