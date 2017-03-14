module.exports = {
  templateUrl: '/components/teacher/list/template.html',
  controller: class {
    constructor(User) {
      'ngInject';
      this.User = User;
    }

    $onInit() {
      this.User
        .query()
        .then(users => this.teachers = users);
    }
  }
};
