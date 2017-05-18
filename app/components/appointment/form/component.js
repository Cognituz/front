module.exports = {
  templateUrl: '/components/appointment/form/template.html',
  bindings: {teacher: '<'},
  controller: class {
    constructor($mdMedia, $mdDialog, Auth, ClassAppointment) {
      'ngInject';

      this.$mdDialog        = $mdDialog;
      this.$mdMedia         = $mdMedia;
      this.Auth             = Auth,
      this.ClassAppointment = ClassAppointment;
    }

    $onInit() {
      this.classType = 'faceToFace';

      this.appointment =
        new this.ClassAppointment({
          teacherId: this.teacher.id,
          studentId: this.Auth.currentUser.id
        });
    }

    close() { this.$mdDialog.hide(); }

    setAppointmentKind() {
      if (this.classType === 'online')
        this.appointment.kind = 'online';
    }

    buildAttachment(url) { return {content: url}; }

    submit() {
      this.appointment.save().then(_ => alert('ESOOkk'))
    }
  }
};
