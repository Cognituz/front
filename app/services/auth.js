// Wraps around satellizer's $auth to give extra functionality
module.exports = ($auth, $q, User) => {
  'ngInject';

  window.$auth = $auth;

  return new class Auth {
    signInViaOauth() {
      return $auth
        .authenticate(...arguments)
        .then(_ => this.getCurrentUser());
    }

    signInViaCredentials() {
      return $auth
        .login(...arguments)
        .then(_ => this.getCurrentUser());
    }

    signUp() {
      return $auth
        .signup(...arguments)
        .then(resp => $auth.setToken(resp.data.token))
        .then(_ => this.getCurrentUser());
    }

    logout() {
      return $auth
        .logout()
        .then(_ => this.unsetCurrentUser());
    }

    getCurrentUser({reload} = {}) {
      if (!$auth.isAuthenticated()) return $q.reject();

      if (this.currentUser && !reload) return $q.resolve(this.currentUser);
      else {
        const userId = $auth.getPayload().user_id;
        return User.get(userId)
          .then(user => this.currentUser = user)
          .then(_ => this.currentUser);
      }
    }

    unsetCurrentUser() { delete this.currentUser; }
  };
}
