const _ = require('lodash');

module.exports = {
  templateUrl: '/components/teacher/profile/editor/template.html',
  controller: class {
    constructor(
      $mdToast,
      Auth,
      MercadoPago,
      Neighborhood,
      User,
      lockingScope
    ) {
      'ngInject';

      this.$mdToast     = $mdToast;
      this.Auth         = Auth;
      this.MercadoPago  = MercadoPago;
      this.lockingScope = lockingScope;

      this.weekDays = {
        [1]: 'Lunes',
        [2]: 'Martes',
        [3]: 'Miércoles',
        [4]: 'Jueves',
        [5]: 'Viernes',
        [6]: 'Sábado',
        [0]: 'Domingo'
      };

      Neighborhood.query().then(ngs => this.neighborhoods = ngs);

      Auth
        .getCurrentUser()
        .then(user => this.teacher = user);
    }

    partialPath(key) {
      const templateDir = '/components/teacher/profile/editor/partials';
      return  `${templateDir}/${key}.html`;
    }

    save() {
      this.lockingScope(this, _ =>
        this.teacher
          .save()
          .then(user => this.Auth.currentUser = angular.copy(user))
          .then(_ => this.showSuccessMessage())
          .catch(resp => this.handleError(resp))
      );
    }

    showSuccessMessage() {
      this.$mdToast.showSimple('Hemos actualizado tu perfil exitosamente');
    }

    handleError(resp) {
      const msg =
        resp.status == 422 ?
        `Operación inválida: ${resp.data.error}s` :
        'Halgo ha salido mal. Por favor intentálo mas tarde'

      this.$mdToast.showSimple(msg);

      throw(resp);
    }

    // Subjects and availability periods, may move into a new component
    markForDestruction(r) { r._destroy = true; }

    addSubject() {
      const u = this.teacher;
      u.taughtSubjects = u.taughtSubjects || [];
      u.taughtSubjects.push({});
    }

    addAvailabilityPeriod() {
      const u = this.teacher;
      u.availabilityPeriods = u.availabilityPeriods || [];
      u.availabilityPeriods.push({});
    }
  }
}
