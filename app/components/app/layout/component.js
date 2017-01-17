module.exports = {
  templateUrl: '/components/app/layout/template.html',
  controller: class {
    constructor($state, $mdToast, Auth) {
      'ngInject';
      this.$mdToast = $mdToast;
      this.$state   = $state;
      this.Auth     = Auth;
    }

    logout() {
      this.Auth
        .logout()
        .then(_ => this.redirectToHome());
    }

    redirectToHome() {
      this.$state.go('home')
        .then(_ => this.$mdToast.showSimple('¡Hasta la próxima!'))
    }
  }
};
