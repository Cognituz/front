const {API_URL} = require('config');

module.exports = (RailsResource) => {
  'ngInject';

  class ContactForm extends RailsResource {};

  ContactForm.configure({
    url:  `${API_URL}/v1/contact_forms`,
    name: 'contact_form'
  });

  return ContactForm;
};
