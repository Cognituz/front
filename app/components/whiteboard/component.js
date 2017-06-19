module.exports = {
  templateUrl: '/components/whiteboard/template.html',

  bindings: {
    onSignal:           '&?',
    readonly:           '<',
    exposeControllerOn: '='
  },

  controller: class {
    DEFAULT_TOOL = "pencil";

    tools = {
      pencil(canvas, ctx) {
        setLineWidth(canvas, ctx, 5);
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle              = "black";
        ctx.lineJoin                 = "round";
        ctx.lineCap                  = "round";
      },

      eraser(canvas, ctx) {
        setLineWidth(canvas, ctx, 25);
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle              = "rgba(0,0,0,1)";
        ctx.lineJoin                 = "square";
        ctx.lineCap                  = "square";
      }
    };

    // To store signals
    signals = [];

    constructor($attrs, $element, $timeout, $window) {
      'ngInject';
      this.$attrs   = $attrs;
      this.$element = $element;
      this.$timeout = $timeout;
      this.$window  = $window;
    }

    $onInit() {
      // Expose this controller on binding
      if (this.$attrs.exposeControllerOn) this.exposeControllerOn = this;

      this.adjustCanvasSize();
      this.setTool();

      this.$window.addEventListener('resize', _ => this.adjustCanvasSize());

      if (!this.readonly) {
        this.$canvas.on("mousedown touchstart", ev => {
          ev.preventDefault();
          this.mouseDown = true;
          this.draw(ev)
        });

        this.$canvas.on("mousemove touchmove", ev => {
          ev.preventDefault();
          this.draw(ev);
        });

        this.$canvas.on("mouseup touchend", ev => {
          ev.preventDefault();
          this.mouseDown = false;
        });

        this.$canvas.on("mouseout touchcancel", ev => {
          ev.preventDefault();
          this.mouseDown = false;
        });
      }
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

    adjustCanvasSize() {
      this.$timeout(_ => {
        this.canvas.width  = this.$canvas.parent().width();
        this.canvas.height = this.$canvas.parent().height();
        this.$setTool(this.currentTool);
        this.$timeout(_ => this.signals.forEach(s => this.consumeSignal(s, false)), 1000);
      });
    }

    draw(ev) {
      const [pointA, pointB] = this.getLine(ev);
      if (!this.mouseDown) { return; }
      this.drawSegment(pointA, pointB);
    }

    getLine(ev) {
      const offset = this.$canvas.offset();
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

      const _x1 = (x1 * this.canvas.width) / parseInt(width);
      const _y1 = (y1 * this.canvas.height) / parseInt(height);
      const _x2 = (x2 * this.canvas.width) / parseInt(width);
      const _y2 = (y2 * this.canvas.height) / parseInt(height);

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
      if (store) this.storeSignal({functionName, args});
    }

    // Store signals to be able to reconstruct the board later
    storeSignal(signal) { this.signals.push(signal); }

    // Transmitable signals
    drawSegment(pointA, pointB) {
      this.$drawSegment(pointA, pointB);
      const canvasSize = [this.canvas.width, this.canvas.height];
      this.signal("$drawSegment", pointA, pointB, canvasSize);
    }

    clear() {
      this.$clear();
      this.signal('$clear');
    }

    setTool(...args) {
      this.$setTool(...args);
      this.signal('$setTool');
    }

    // The dollar sign in the method name means it is transmitable
    $drawSegment(pointA, pointB, canvasSize) {
      const [[_x1,_y1], [_x2,_y2]] =
        canvasSize ?
        this.getRelativeCoords(pointA, pointB, canvasSize) :
        [pointA, pointB];

      this.ctx.beginPath();
      this.ctx.moveTo(_x1, _y1);
      this.ctx.lineTo(_x2, _y2);
      this.ctx.closePath();
      this.ctx.stroke();
    }

    $clear() { this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height); }

    $setTool(toolName = this.DEFAULT_TOOL) {
      this.$timeout(_ => {
        this.tools[toolName](this.canvas, this.ctx);
        this.currentTool = toolName;
      });
    }
  }
};

function setLineWidth(canvas, ctx, int) {
  ctx.lineWidth = (int * canvas.width)/800;
}
