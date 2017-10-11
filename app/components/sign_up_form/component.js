module.exports = {
  templateUrl: '/components/sign_up_form/template.html',
  bindings: {userType: '@'},
  controller: class {
    constructor($mdToast, $state, Auth, $auth, lockingScope) {
      'ngInject';
      this.$mdToast     = $mdToast;
      this.$state       = $state;
      this.$auth        = $auth;
      this.Auth         = Auth;
      this.lockingScope = lockingScope;
    }

    registerWithFacebook() {
      this.lockingScope(this, _ =>
        this.$auth
          .authenticate('facebook')
          .then(_ => this.afterRegisterSuccess())
      );
    }

    registerWithCredentials() {
      this.lockingScope(this, _ =>
        this.Auth
          .signUp(this.credentials)
          .then(_ => this.afterRegisterSuccess())
          .catch(resp =>
            resp.status === 422 ?
              this.$mdToast.showSimple('Ese email ya sido tomado') :
              this.$mdToast.showSimple('Ha habido un problema, por favor intentelo mas tarde.')
          )
      );
    }

    afterRegisterSuccess() {
      this.credentials = {};

      this.$state
        .go('app.s.students.profile.edit', {
          afterSaveRedirectTo: 'app.s.teachers.list'
        })
        .then(_ => this.$mdToast.showSimple('¡Bienvenido a Cognituz!'));
    }
  }
};
