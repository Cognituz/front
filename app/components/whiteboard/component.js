import {isMatch, memoize} from 'lodash';

module.exports = {
  templateUrl: '/components/whiteboard/template.html',

  bindings: {
    onSignal:           '&?',
    readonly:           '<',
    exposeControllerOn: '='
  },

  controller: class {
    currentTool        = 'pencil';
    currentToolOptions = {
      thickness: 5,
      color:    "#000000"
    };

    tools = {
      pencil(toolOptions = {}) {
        this.setLineWidth(toolOptions.thickness);
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle              = toolOptions.color;
        this.ctx.lineJoin                 = "round";
        this.ctx.lineCap                  = "round";
      },

      eraser(toolOptions = {}) {
        this.setLineWidth(25);
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.strokeStyle              = "rgba(0,0,0,1)";
        this.ctx.lineJoin                 = "square";
        this.ctx.lineCap                  = "square";
      }
    };

    // To store signals
    signals = [];

    constructor($attrs, $element, $scope, $timeout, $window) {
      'ngInject';
      this.$attrs   = $attrs;
      this.$element = $element;
      this.$scope   = $scope;
      this.$timeout = $timeout;
      this.$window  = $window;
    }

    get $canvas() {
      if (!this._$canvas) this._$canvas = this.$element.find("canvas");
      return this._$canvas;
    }

    get canvas() {
      if (!this._canvas) this._canvas = this.$canvas[0];
      return this._canvas;
    }

    get ctx() {
      if (!this._ctx) this._ctx = this.canvas.getContext('2d');
      return this._ctx;
    }

    $onInit() {
      // Expose this controller on binding
      if (this.$attrs.exposeControllerOn) this.exposeControllerOn = this;

      this.resize();
      this.$window.addEventListener('resize', _ =>
        this.$scope.$apply(_ => this.resize())
      );

      if (!this.readonly) {
        this.$element.on("mousedown touchstart", ev => {
          ev.preventDefault();
          this.mouseDown = true;
          this.draw(ev)
        });

        this.$element.on("mousemove touchmove", ev => {
          ev.preventDefault();
          this.draw(ev);
        });

        this.$element.on("mouseup touchend", ev => {
          ev.preventDefault();
          this.mouseDown = false;
        });

        this.$element.on("mouseout touchcancel", ev => {
          ev.preventDefault();
          this.mouseDown = false;
        });
      }
    }

    // Although canvas is set to fill container via layout-fill
    // we still need to resize it manually to update it's inner state
    // and really fill it's contaier
    resize(delay) {
      this.resizing = true
      this.doResize(delay).then(_ => this.resizing = false);
    }

    doResize(delay = 0) {
      return this.$timeout(_ => {
        this.canvas.width  = this.$element.width();
        this.canvas.height = this.$element.height();
        this.reconstruct();
      }, delay);
    }

    draw(ev) {
      const [pointA, pointB] = this.getLine(ev);
      if (!this.mouseDown || this.resizing) { return; }
      this.drawSegment(pointA, pointB);
    }

    getLine(ev) {
      const offset = this.$element.offset();
      const pointB = [
        ev.pageX - offset.left,
        ev.pageY - offset.top
      ];
      const pointA = this.lastPoint;
      const line = [pointA, pointB];

      this.lastPoint = pointB;

      return line;
    }

    getRelativeCoords([x1,y1], [x2,y2], [width, height]) {
      const _coords = [];

      const _x1 = (x1 * this.$canvas.width()) / parseInt(width);
      const _y1 = (y1 * this.$canvas.height()) / parseInt(height);
      const _x2 = (x2 * this.$canvas.width()) / parseInt(width);
      const _y2 = (y2 * this.$canvas.height()) / parseInt(height);

      return [[_x1,_y1], [_x2,_y2]];
    }

    // Remote capabilities
    signal(functionName, ...args) {
      this.storeSignal({functionName, args});

      this.onSignal && this.onSignal({
        $functionName: functionName,
        $args:         args
      });
    }

    consumeSignal({functionName, args}, store = true) {
      this[functionName].apply(this, args);
      console.log({functionName, args});
      if (store) this.storeSignal({functionName, args});
    }

    reconstruct() { this.signals.forEach(s => this.consumeSignal(s, false)); }

    // Store signals to be able to reconstruct the board later
    storeSignal(signal) { this.signals.push(signal); }

    // Transmitable signals
    drawSegment(pointA, pointB) {
      const commonArgs = [pointA, pointB, this.currentTool, this.currentToolOptions];
      this.$drawSegment(...commonArgs);
      const canvasSize = [this.$canvas.width(), this.$canvas.height()];
      this.signal("$drawSegment", ...commonArgs, canvasSize);
    }

    clear() {
      this.$clear();
      this.signal('$clear');
    }

    setTool(toolName, toolOptions = this.currentToolOptions) {
      this.$setTool(toolName, toolOptions)
      this.signal('$setTool', toolName, toolOptions);
    }

    // The dollar sign in the method name means it is transmitable
    $drawSegment(pointA, pointB, tool, toolOptions, canvasSize) {
      this.applyTool(tool, toolOptions);

      const [[_x1,_y1], [_x2,_y2]] =
        canvasSize ?
        this.getRelativeCoords(pointA, pointB, canvasSize) :
        [pointA, pointB];

      this.ctx.beginPath();
      this.ctx.moveTo(_x1, _y1);
      this.ctx.lineTo(_x2, _y2);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.restore();
    }

    $clear() { this.ctx.clearRect(0,0, this.$canvas.width(), this.$canvas.height()); }

    $setTool(toolName, toolOptions) {
      this.currentTool        = toolName
      this.currentToolOptions = toolOptions
    }

    // Other helpers
    setLineWidth(val) {
      this.ctx.lineWidth = (val * this.canvas.width)/800;
    }

    applyTool(tool, toolOptions, forceUpdate) {
      this.tools[tool].call(this, toolOptions);
    }
  }
};

