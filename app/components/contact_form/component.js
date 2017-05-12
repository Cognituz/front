module.exports = {
  templateUrl: '/components/contact_form/template.html',
  controller: class {
    constructor($mdToast, ContactForm) {
      'ngInject';

      this.$mdToast    = $mdToast;
      this.ContactForm = ContactForm;

      this.init();
    }

    init() {
      this.model = new this.ContactForm();
    }

    save() {
      if (this.saving) return;
      this.saving = true

      this.model.save()
        .then(_ => {
          this.saving = false;
          this.$mdToast.showSimple('Gracias por contactarte con nosotros!');
          this.init();
        });
    }
  }
};
