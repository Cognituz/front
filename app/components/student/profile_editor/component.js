module.exports = {
  templateUrl: '/components/student/profile_editor/template.html',
  bindings: {student: '='},
  controller: class {
    constructor($mdToast, User, lockingScope) {
      'ngInject';
      this.$mdToast     = $mdToast;
      this.lockingScope = lockingScope;

      this.schoolYears = User.SCHOOL_YEARS;
    }

    save() {
      this.lockingScope(this, _ =>
        this.student
          .save()
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
          'Datos inválidos' :
          'Halgo ha salido mal. Por favor intentálo mas tarde'

      return this.$mdToast.showSimple(msg);
    }
  }
};
