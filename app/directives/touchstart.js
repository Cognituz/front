module.exports = () => ({
  controller($scope, $element, $attrs) {
    'ngInject';

    const method = $element.attr('ng-touchstart');
    $element.bind('touchstart', onTouchStart);

    function onTouchStart(event) {
      $scope.$event = event;
      $scope.$apply(method);
    }
  }
});
