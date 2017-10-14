module.exports = {
  templateUrl: '/components/student/profile/password/template.html',
  bindings: {afterSave: '&?'},
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
          .then(user => this.handleSuccess(user))
          .catch(resp => this.handleError(resp))
      );
    }

    showSuccessMessage() {
      this.$mdToast.showSimple('Hemos actualizado tu perfil exitosamente');
    }

    handleSuccess(user) {
      this.Auth.currentUser = angular.copy(user);
      this.showSuccessMessage();
      this.afterSave && this.afterSave();
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
