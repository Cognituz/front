module.exports = {
  templateUrl: '/components/teacher/profile/editor/template.html',
  controller: class {
    constructor(
      $mdToast,
      Auth,
      SubjectGroup,
      User,
      lockingScope
    ) {
      'ngInject';

      this.$mdToast     = $mdToast;
      this.Auth         = Auth
      this.lockingScope = lockingScope;

      Auth
        .getCurrentUser()
        .then(user => this.teacher = this.setUserDefaults(user));

      SubjectGroup.query().then(sgs => this.subjectGroups = sgs);
    }

    setUserDefaults(u) {
      u.taughtSubjects = u.taughtSubjects || [];
      return u;
    }

    addSubject() { this.teacher.taughtSubjects.push({}); }
    removeSubject(s) { s._destroy = true; }

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
        `Operación inválida: ${resp.data.errors}` :
        'Halgo ha salido mal. Por favor intentálo mas tarde'

      this.$mdToast.showSimple(msg);

      throw(resp);
    }
  }
}
