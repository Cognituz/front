module.exports = {
  template: `
    <div
      block='ctz-color-picker'
      class='md-whiteframe-z1'
      md-ink-ripple
      style='
        width:    24px;
        height:   24px;
        cursor:   pointer;
        position: relative
      '
      ng-style='{background: $ctrl.color}'
      ng-click='$ctrl.onClick($event)'
    />
  `,
  require: {ngModel: 'ngModel'},
  controller: class {
    constructor($mdColorPicker) {
      'ngInject';
      this.$mdColorPicker = $mdColorPicker;
    }

    $onInit() {
      this.ngModel.$render = _ => this.color = this.ngModel.$viewValue;
    }

    onClick($event) {
      this.$mdColorPicker.show({
        $event,
        value:                  this.color,
        clickOutsideToClose:    true,
        hasBackDrop:            true,
        mdColorClearButton:     false,
        mdColorAlphaChannel:    false,
        mdColorSliders:         false,
        mdColorGenericPalette:  true,
        mdColorMaterialPalette: false,
        mdColorRgb:             false,
        mdColorHsl:             false
      })
        .then(color => this.setColor(color));
    }

    setColor(color) {
      this.color = color;
      this.ngModel.$setViewValue(color);
    }
  }
}
