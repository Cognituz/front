const $ = require('jquery');

module.exports = () => {
  return {
    link(scope, el, attrs) {
      el.addClass('ctz-loading-overlay-container');
      scope.$watch(attrs.ctzLoading, updateLoading);
      function updateLoading(bool) { bool ? setLoading() : unsetLoading(); }
      function setLoading() { el.css('filter', 'blur(10px)'); }
      function unsetLoading() { el.css('filter', ''); }
    }
  };
};
