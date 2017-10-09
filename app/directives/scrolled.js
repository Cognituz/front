module.exports = () => ({
  controller($scope, $element, $attrs) {
    'ngInject';

    $($element).scroll(function() {
      if($($element).scrollTop() > 50) {
        console.log(11111)
        $(".ctz-home__toolbar").addClass("toolbar-scrolled md-whiteframe-z1");
      } else {
        console.log(2222)
        $(".ctz-home__toolbar").removeClass("toolbar-scrolled md-whiteframe-z1");
      }
    });
  }
});
