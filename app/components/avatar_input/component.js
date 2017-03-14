module.exports = {
  templateUrl: '/components/avatar_input/template.html',
  require: {ngModel: 'ngModel'},
  controller: class {
    constructor($element, Upload) {
      'ngInject';

      this.$element = $element;
      this.Upload   = Upload;
    }

    $onInit() {
      const that = this;
      this.ngModel.$render = _ => that.imageSrc = that.ngModel.$modelValue;
    }

    handleUpload(file) {
      this.Upload
        .base64DataUrl(file)
        .then(url => {
          this.ngModel.$setViewValue(url);
          this.imageSrc = url;
        });
    }
  }
};
