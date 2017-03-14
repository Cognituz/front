module.exports = {
  templateUrl: '/components/student/profile_editor/template.html',
  controller: class {
    constructor($mdToast, Auth, User, lockingScope) {
      'ngInject';
      this.$mdToast     = $mdToast;
      this.Auth         = Auth
      this.lockingScope = lockingScope;
      this.schoolYears  = User.SCHOOL_YEARS;

      Auth
        .getCurrentUser()
        .then(user => this.student = angular.copy(user));
    }

    save() {
      this.lockingScope(this, _ =>
        this.student
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
        `Operación inválida: ${resp.data.errors}` :
        'Halgo ha salido mal. Por favor intentálo mas tarde'

      this.$mdToast.showSimple(msg);

      throw(resp);
    }
  }
};
