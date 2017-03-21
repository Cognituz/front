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

      const defaultUser = {taughtSubjects: []};

      Auth
        .getCurrentUser()
        .then(user => this.teacher = angular.extend(defaultUser, user));

      SubjectGroup.query().then(sgs => this.subjectGroups = sgs);
    }

    addSubject() { this.teacher.taughtSubjects.push({}); }
    removeSubject(s) { s._destroy = true; }

    partialPath(key) {
      const templateDir = '/components/teacher/profile/editor/partials';
      return  `${templateDir}/${key}.html`;
    }
  }
}
