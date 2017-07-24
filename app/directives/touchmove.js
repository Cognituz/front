module.exports = () => ({
  controller($scope, $element, $attrs) {
    'ngInject';

    const method = $element.attr('ng-touchmove');
    $element.bind('touchstart', onTouchStart);

    function onTouchStart(event) {
      event.preventDefault();
      $element.bind('touchmove', onTouchMove);
      $element.bind('touchend', onTouchEnd);
    }

    function onTouchMove(event) {
      $scope.$event = event;
      $scope.$apply(method);
    }

    function onTouchEnd(event) {
      event.preventDefault();
      $element.unbind('touchmove', onTouchMove);
      $element.unbind('touchend', onTouchEnd);
    }
  }
});
