module.exports = {
  templateUrl: '/components/recover_password/template.html',
  controller: class {
    constructor($mdToast) {
      'ngInject';
      this.$mdToast     = $mdToast;
    }

    sendForm() {
      this.$mdToast.showSimple('Se envio un email con las instrucciones para recuperar tu contraseña.');
    }
  }
};
