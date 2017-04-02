module.exports = {
  templateUrl: '/components/teacher/profile/editor/template.html',
  controller: class {
    constructor($mdToast, Auth, User, lockingScope) {
      'ngInject';
      this.Auth = Auth

      Auth
        .getCurrentUser()
        .then(user => this.teacher = angular.copy(user));
    }
  }
};
