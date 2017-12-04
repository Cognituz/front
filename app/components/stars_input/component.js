module.exports = ({
  templateUrl: '/components/stars_input/template.html',
  bindings: {showEmpty: '='},
  controller: class {
    constructor($mdDialog, $mdMedia) {
      'ngInject';
      this.$mdDialog             = $mdDialog;
      this.$mdMedia              = $mdMedia;
    }

    $onInit() {
      this.stars = 5;
      console.log(this.stars)
    };
  }
});
