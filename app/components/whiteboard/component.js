import {isMatch, memoize} from 'lodash';

module.exports = {
  templateUrl: '/components/whiteboard/template.html',

  bindings: {
    onSignal:           '&?',
    readonly:           '<',
    exposeControllerOn: '=',
    signals:            '<'
  },

  controller: class {
    currentTool = 'pencil';
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
      },

      textInserter(toolOptions = {}) {
        this.ctx.globalCompositeOperation = "source-over";
        this.textAlign                    = 'center';
        this.ctx.textBaseline             = 'middle';
        this.ctx.font                     = '3vw Dosis';
        this.ctx.fillStyle                = 'black';
      }
    };

    constructor($attrs, $element, $mdDialog, $scope, $timeout, $window) {
      'ngInject';
      this.$attrs    = $attrs;
      this.$element  = $element;
      this.$mdDialog = $mdDialog;
      this.$scope    = $scope;
      this.$timeout  = $timeout;
      this.$window   = $window;
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

      // Duplicate signals to prevent modifing the array passed via bindings
      if (this.signals) this.signals = this.signals.slice();

      this.resize();
      this.$window.addEventListener('resize', _ =>
        this.$scope.$apply(_ => this.resize())
      );

      if (!this.readonly) {
        this.$element.on("mousedown touchstart", ev => {
          ev.preventDefault();
          this.mouseDown = true;
          this.drawLine(ev)
        });

        this.$element.on("mousemove touchmove", ev => {
          ev.preventDefault();
          this.drawLine(ev);
        });

        this.$element.on("mouseup touchend", ev => {
          ev.preventDefault();
          this.mouseDown = false;
        });

        this.$element.on("mouseout touchcancel", ev => {
          ev.preventDefault();
          this.mouseDown = false;
        });

        this.$element.on("click touchstart", ev => {
          ev.preventDefault();
          this.drawText(ev);
        })
      }
    }

    // Although canvas is set to fill container via layout-fill
    // we still need to resize it manually to update it's inner state
    // and really fill it's contaier. Otherwise the internal width and height
    // remains the same and causes drawLine errors.
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

    getLine(ev) {
      const pointB = this.extractCoordinates(ev);
      const pointA = this.lastPoint;
      const line = [pointA, pointB];

      this.lastPoint = pointB;

      return line;
    }

    // Remote capabilities
    signal(functionName, ...args) {
      const signal = {functionName, args};
      this.storeSignal(signal); // Store locally
      this.onSignal && this.onSignal({$signal: signal});
    }

    consumeSignal({functionName, args}, store = true) {
      this[functionName].apply(this, args);
      if (store) this.storeSignal({functionName, args});
    }

    reconstruct() { this.signals.forEach(s => this.consumeSignal(s, false)); }

    // Store signals to be able to reconstruct the board later
    storeSignal(signal) { this.signals.push(signal); }

    // Transmitable signals
    drawLine(ev) {
      const [pointA, pointB] = this.getLine(ev);
      if (
        ['pencil', 'eraser'].indexOf(this.currentTool) === -1 ||
        !this.mouseDown ||
        this.resizing
      ) { return; }
      this.doDrawLine(pointA, pointB);
    }

    doDrawLine(pointA, pointB) {
      const commonArgs = [pointA, pointB, this.currentTool, this.currentToolOptions];
      this.$drawSegment(...commonArgs);
      const canvasSize = [this.$canvas.width(), this.$canvas.height()];
      this.signal("$drawSegment", ...commonArgs, canvasSize);
    }

    drawText(ev) {
      if (this.currentTool !== 'textInserter') return;
      this.applyTool()
      const point = this.extractCoordinates(ev);
      this.getTextToInsert(ev)
        .then(text => this.doDrawText(point, text));
    }

    doDrawText(point, text) {
      this.$drawText(point, text);
      this.signal('$drawText', point, text);
    }

    getTextToInsert(ev) {
      return this.$mdDialog.show(
        this.$mdDialog
          .prompt()
          .placeholder('Texto a insertar')
          .targetEvent(ev)
          .cancel('Cancelar')
          .ok('Insertar')
      );
    }

    clear() {
      this.$clear();
      this.signal('$clear');
    }

    setTool(toolName, toolOptions = this.currentToolOptions) {
      this.currentTool        = toolName
      this.currentToolOptions = toolOptions
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

    $drawText([x,y], text) {
      this.applyTool('textInserter');
      this.ctx.fillText(text, x, y);
    }

    $clear() { this.ctx.clearRect(0,0, this.$canvas.width(), this.$canvas.height()); }

    // Other helpers
    setLineWidth(val) {
      this.ctx.lineWidth = (val * this.canvas.width)/800;
    }

    applyTool(
      tool = this.currentTool,
      toolOptions = this.currentToolOptions
    ) {
      this.tools[tool].call(this, toolOptions);
    }

    getRelativeCoords([x1,y1], [x2,y2], [width, height]) {
      const _coords = [];

      const _x1 = (x1 * this.$canvas.width()) / parseInt(width);
      const _y1 = (y1 * this.$canvas.height()) / parseInt(height);
      const _x2 = (x2 * this.$canvas.width()) / parseInt(width);
      const _y2 = (y2 * this.$canvas.height()) / parseInt(height);

      return [[_x1,_y1], [_x2,_y2]];
    }

    extractCoordinates(ev) {
      const offset = this.$element.offset();

      return [
        ev.pageX - offset.left,
        ev.pageY - offset.top
      ];
    }
  }
};

