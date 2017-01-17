// Wraps around satellizer's $auth to give extra functionality
module.exports = ($auth, $q, User) => {
  'ngInject';

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
        return User.get(userId).then(user => this.currentUser = user);
      }
    }

    unsetCurrentUser() { delete this.currentUser; }
  };
}
