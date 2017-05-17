module.exports = {
  templateUrl: '/components/file_input/template.html',
  require: {ngModel: 'ngModel'},
  bindings: {transform: '&?'},
  controller: class {
    constructor(Upload) {
      'ngInject';
      this.Upload = Upload;
    }

    $onInit() {
      this.ngModel.$render = _ => this.model = this.ngModel.$modelValue;
    }

    handleFiles(files) {
      this.Upload
        .base64DataUrl(files)
        .then(urls => this.setModel(urls));
    }

    setModel(urls) {
      urls = this.transform ? urls.map(u => this.transform({$url: u})) : urls;
      this.ngModel.$setViewValue(urls);
    }
  }
};
