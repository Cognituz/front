module.exports = {
  template: `
    <div block='ctz-video-holder'>
      <video
        autoplay
        style='
          display:          block;
          width:            100%;
          height:           auto;
          background-color: black
        '
      />
    </div>
  `,

  bindings: {stream: '='},

  controller: class {
    constructor($element, $scope) {
      'ngInject';
      this.$element = $element;
      this.$scope   = $scope;
    }

    $onInit() {
      this.updateDisplay();

      this.$scope.$watch(
        _ => this.stream,
        s => this.updateDisplay()
      );
    }

    updateDisplay() {
      console.log(this.stream)
      if (!this.stream) return;
      console.log(22222222)
      this.$video.srcObject = this.stream;
    }

    get $video() { return this.$element.find('video')[0]; }
  }
};
