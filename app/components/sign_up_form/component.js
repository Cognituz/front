module.exports = {
  templateUrl: '/components/sign_up_form/template.html',
  bindings: {userType: '@'},
  controller: class {
    constructor($auth, $mdToast, $state, lockingScope) {
      'ngInject';
      this.$auth        = $auth;
      this.$mdToast     = $mdToast;
      this.$state       = $state;
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
        this.$auth
          .signup(this.credentials)
          .then(_ => this.afterRegisterSuccess())
          .catch(resp => {
            if (resp.status = 422)
              this.$mdToast.showSimple('Ese email ya sido tomado')
            else
              this.$mdToast.showSimple('Ha habido un problema, por favor intentelo mas tarde.');

            this.credentials = {};
          })
      );
    }

    afterRegisterSuccess() {
      this.$mdToast.showSimple('¡Bienvenido a Cognituz!')
      this.$state.go('app.teachers.list')
    }
  }
};
