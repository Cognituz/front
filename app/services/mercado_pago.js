const qs        = require('qs');
const {API_URL} = require('config');

module.exports = ($auth, $http, Auth) => {
  "ngInject";

  return new class MercadoPago {
    link() {
      const queryString =
        qs.stringify({
          token:                  $auth.getToken(),
          on_success_redirect_to: window.location.toString()
        });

      window.location = `${API_URL}/v1/mercado_pago/auth/link?${queryString}`;
    }

    unlink(user) {
      return $http.delete(`${API_URL}/v1/mercado_pago/auth/unlink?`)
        .then(_ => user.get());
    }
  }
};
