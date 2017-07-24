module.exports = () => ({
  controller($scope, $element, $attrs) {
    'ngInject';

    const method = $element.attr('ng-touchend');
    $element.bind('touchend', onTouchEnd);

    function onTouchEnd(event) {
      $scope.$event = event;
      $scope.$apply(method);
    }
  }
});
