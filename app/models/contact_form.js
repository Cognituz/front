module.exports = (RailsResource) => {
  'ngInject';

  class ContactForm extends RailsResource {};

  ContactForm.configure({
    url:  'http://localhost:3000/v1/contact_forms',
    name: 'contact_form'
  });

  return ContactForm;
};
