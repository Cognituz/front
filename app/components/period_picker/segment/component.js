module.exports = {
  template: pug `
    div(
      elem='ctz-period-picker-segment'
      layout-fill
      ng-style='{\
        top:    $ctrl.startY + "%", \
        height: $ctrl.height + "%" \
      }'
    )
  `,

  bindings: {
    startY: '<',
    height: '<'
  }
};
