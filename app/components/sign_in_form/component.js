module.exports = {
  templateUrl: '/components/sign_in_form/template.html',
  bindings: {userType: '@'},
  controller: class {
    constructor($auth, $mdToast, $state, lockingScope) {
      'ngInject';
      this.$auth        = $auth;
      this.$mdToast     = $mdToast;
      this.$state       = $state;
      this.lockingScope = lockingScope;
    }

    loginWithFacebook() {
      this.lockingScope(this, _ =>
        this.$auth
          .authenticate('facebook')
          .then(_ => this.afterLoginSuccess())
      );
    }

    loginWithCredentials() {
      this.lockingScope(this, _ =
        this.$auth
          .login(this.credentials)
          .then(_ => this.afterLoginSuccess())
      )
    }

    afterLoginSuccess() {
      this.$mdToast.showSimple('¡Bienvenido a Cognituz!')
      this.$state.go('app.teachers.list')
    }
  }
};
