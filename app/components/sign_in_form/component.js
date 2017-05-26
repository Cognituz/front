module.exports = {
  templateUrl: '/components/sign_in_form/template.html',
  bindings: {userType: '@'},
  controller: class {
    constructor($mdToast, $state, Auth, lockingScope) {
      'ngInject';

      this.$mdToast     = $mdToast;
      this.$state       = $state;
      this.Auth         = Auth;
      this.lockingScope = lockingScope;
    }

    loginWithFacebook() {
      const data = {userType: this.userType};

      this.lockingScope(this, _ =>
        this.Auth
          .signInViaOauth('facebook', {data})
          .then(_ => this.afterLoginSuccess())
      );
    }

    loginWithCredentials() {
      this.lockingScope(this, _ =>
        this.Auth
          .signInViaCredentials(this.credentials)
          .then(_ => this.afterLoginSuccess())
          .catch(_ => this.afterLoginFailure())
      );
    }

    afterLoginSuccess() {
      this.$state.go('app.s.teachers.list')
        .then(_ => this.$mdToast.showSimple('¡Bienvenido a Cognituz!'));
    }

    afterLoginFailure() {
      this.$mdToast.showSimple('Email o contraseña incorrectos');
    }
  }
};
