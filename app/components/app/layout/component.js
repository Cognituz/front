module.exports = {
  templateUrl: '/components/app/layout/template.html',
  controller: class {
    constructor(lock) {
      'ngInject';
      this.lock = lock;
    }

    $onInit() {
      this.lock.interceptHash();
      this.lock.show();
    }
  }
};
