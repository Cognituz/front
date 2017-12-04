module.exports = {
  templateUrl: '/components/appointment/form/template.html',
  bindings: {
    teacher: '<',
    filters: '<'
  },
  controller: class {
    classType = 'faceToFace';
    minDate   = moment().add(1, 'day');
    maxDate   = moment().add(2, 'weeks');

    constructor($mdDialog, $mdMedia, $mdToast, $q, Auth, ClassAppointment, PaymentPreference) {
      'ngInject';

      this.$mdDialog         = $mdDialog;
      this.$mdMedia          = $mdMedia;
      this.$mdToast          = $mdToast;
      this.$q                = $q;
      this.Auth              = Auth,
      this.ClassAppointment  = ClassAppointment;
      this.PaymentPreference = PaymentPreference;
    }

    $onInit() {
      this.appointment =
        new this.ClassAppointment({
          teacher:   this.teacher,
          teacherId: this.teacher.id,
          studentId: this.Auth.currentUser.id,

          // for testing purposes, remove later
          kind:      'at_public_place',
          placeDesc: 'un lugar re copado',
          subjects:  this.filters ? this.filters.taughtSubjectsIds : '',
          desc:      'Quiero saber el teorema de pitágoras',
          duration:  this.filters ? this.filters.availableAt.duration : '',
          address:  this.filters ? this.filters.address : '',
          startsAt:  this.filters ? this.filters.availableAt.date : ''
        });
    }

    close() { this.$mdDialog.hide(); }

    setAppointmentKind() {
      if (this.classType === 'online')
        this.appointment.kind = 'online';
    }

    buildAttachment(url) { return {content: url}; }

    submit() {
      this.createAppointment()
        .then(appointment => {
          const initPoint = appointment.paymentPreference.initPoint;
          return this.launchPaymentDialog(initPoint);
        })
        .then(_ => {
          this.$mdDialog.hide();
          this.$mdToast.showSimple('Por ahora las clases son gratis!')
        })
        .catch((...args) => {
          const msg = 'Algo ha salido mal, intentalo mas tarde por favor';
          const toast = this.$mdToast.simple().textContent(msg);
          this.$mdToast.show(toast);
          return this.$q.reject(...args);
          // this.$mdDialog.hide();
        });
    }

    createAppointment() {
      return this.appointment.id ? this.$q.resolve() : this.appointment.save();
    }

    launchPaymentDialog(initPoint) {
      return this.$q((resolve, reject) =>
        $MPC.openCheckout({
          url: initPoint,
          mode: "modal",
          onreturn: data => {
            const success = data.collection_status === "approved";
            success ? resolve() : reject();
          }
        })
      );
    }
  }
};
