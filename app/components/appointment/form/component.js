module.exports = {
  templateUrl: '/components/appointment/form/template.html',
  bindings: {teacher: '<'},
  controller: class {
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
      this.classType = 'faceToFace';

      this.appointment =
        new this.ClassAppointment({
          teacher:   this.teacher,
          teacherId: this.teacher.id,
          studentId: this.Auth.currentUser.id,

          // for testing purposes, remove later
          kind:      'at_public_place',
          placeDesc: 'un lugar re copado',
          subjects:  this.teacher.taughtSubjects.slice(0, 3),
          desc:      'Quiero saber el teorema de pitágoras',
          startsAt:  new Date(2017, 6, 23, 16, 30),
          duration:  2
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
        .catch(_ => {
          const msg = 'Algo ha salido mal, intentalo mas tarde por favor';
          const toast = this.$mdToast.simple().textContent(msg);
          this.$mdToast.show(toast);
          this.$mdDialog.hide();
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
