const {API_URL} = require('config');

module.exports = (
  RailsResource,
  railsSerializer
) => {
  'ngInject';

  class PaymentPreference extends RailsResource {}

  PaymentPreference.configure({
    url:  `${API_URL}/v1/mercado_pago/payment_preferences`,
    name: 'payment_preference',
  });

  return PaymentPreference;
};
