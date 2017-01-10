module.exports = {
  templateUrl: '/components/sign_in_form/template.html',
  controller: class {
    constructor(Auth) {
      this.Auth = Auth;
    }

    $onInit() { this.step = 1; }

    setUserType(type) {
      this.userType = type,
      this.step++;
      this.credentials = {};
    }

    save() {
      this.Auth.login(this.credentials);
    }
  }
};
