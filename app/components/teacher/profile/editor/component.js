module.exports = {
  templateUrl: '/components/teacher/profile/editor/template.html',
  controller: class {
    constructor(
      $mdToast,
      Auth,
      Neighborhood,
      SubjectGroup,
      User,
      lockingScope
    ) {
      'ngInject';

      this.$mdToast     = $mdToast;
      this.Auth         = Auth
      this.lockingScope = lockingScope;

      Neighborhood.query().then(ngs => this.neighborhoods = ngs);

      SubjectGroup.query()
        .then(sgs => {
          this.subjectGroups = sgs;

          Auth
            .getCurrentUser()
            .then(user => this.teacher = user);
        });
    }

    addSubject() {
      const u = this.teacher;
      u.taughtSubjects = u.taughtSubjects || [];
      u.taughtSubjects.push({});
    }
    removeSubject(s) { s._destroy = true; }

    setMetaLevel(ts) {
      ts.$level = this.subjectGroups.find(sb => sb.name == ts.level);
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
  }
}
