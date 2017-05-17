module.exports = {
  templateUrl: '/components/appointment/form/template.html',
  bindings: {teacher: '<'},
  controller: class {
    constructor($mdMedia, $mdDialog) {
      'ngInject';

      this.$mdDialog = $mdDialog;
      this.$mdMedia  = $mdMedia;
    }

    $onInit() {
      this.classType = 'faceToFace';
    }

    close() { this.$mdDialog.hide(); }
  }
};
