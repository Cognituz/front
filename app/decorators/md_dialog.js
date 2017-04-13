module.exports = $delegate => {
  'ngInject';

  const oldShow = $delegate.show;

  $delegate.show = (opts = {}) => {
    const defaultOpts = {
      bindToController: true,
      controllerAs:     '$ctrl',
      controller:       () => {}
    };

    const newOptions = angular.extend({}, defaultOpts, opts);

    return oldShow.call($delegate, newOptions);
  }

  return $delegate;
};
