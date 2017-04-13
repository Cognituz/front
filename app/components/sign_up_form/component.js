module.exports = {
  templateUrl: '/components/sign_up_form/template.html',
  bindings: {userType: '@'},
  controller: class {
    constructor($mdToast, $state, Auth, lockingScope) {
      'ngInject';
      this.$mdToast     = $mdToast;
      this.$state       = $state;
      this.Auth         = Auth;
      this.lockingScope = lockingScope;
    }

    registerWithFacebook() {
      this.lockingScope(this, _ =>
        this.$auth
          .authenticate('facebook', {userType: 'student'})
          .then(_ => this.afterRegisterSuccess())
      );
    }

    registerWithCredentials() {
      this.lockingScope(this, _ =>
        this.Auth
          .signUp(this.credentials)
          .then(_ => this.afterRegisterSuccess())
          .catch(resp => {
            if (resp.status = 422)
              this.$mdToast.showSimple('Ese email ya sido tomado')
            else
              this.$mdToast.showSimple('Ha habido un problema, por favor intentelo mas tarde.');
          })
      );
    }

    afterRegisterSuccess() {
      this.credentials = {};

      this.$state
        .go('app.authenticated.students.profile.edit', {
          afterSaveRedirectTo: 'app.authenticated.teachers.list'
        })
        .then(_ => this.$mdToast.showSimple('¡Bienvenido a Cognituz!'));
    }
  }
};
