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
      this.$setTool();
      this.$window.addEventListener('resize', _ => {
        this.$setTool();
        this.adjustCanvasSize();
      });

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
      });
    }

    draw(ev) {
      const coords = this.setCoordinates(ev);
      if (!this.mouseDown) { return; }
      const canvasSize = [this.canvas.width, this.canvas.height];
      this.$drawSegment(coords);
      this.signal("$drawSegment", coords, canvasSize);
    }


    setCoordinates(ev) {
      this.coords = this.coords || [];

      this.coords[0] = this.coords[2];
      this.coords[1] = this.coords[3];

      const offset = this.$canvas.offset();

      this.coords[2] = ev.pageX - offset.left;
      this.coords[3] = ev.pageY - offset.top;

      return this.coords;
    }

    getRelativeCoords(coords, canvasSize) {
      var _coords = [];

      _coords[0] = (coords[0] * this.canvas.width) / parseInt(canvasSize[0]);
      _coords[1] = (coords[1] * this.canvas.height) / parseInt(canvasSize[1]);
      _coords[2] = (coords[2] * this.canvas.width) / parseInt(canvasSize[0]);
      _coords[3] = (coords[3] * this.canvas.height) / parseInt(canvasSize[1]);

      return _coords;
    }

    // Remote capabilities
    signal(functionName, ...args) {
      this.onSignal && this.onSignal({
        $functionName: functionName,
        $args:         args
      });
    }

    consumeSignal({functionName, args}) { this[functionName].apply(this, args); }

    clear() {
      this.$clear();
      this.signal('$clear');
    }

    setTool(...args) {
      this.$setTool(...args);
      this.signal('$setTool');
    }

    // The dollar sign in the method name means it is transmitable
    $drawSegment(coords, canvasSize) {
      const _coords =
        canvasSize ?
        this.getRelativeCoords(coords, canvasSize) :
        coords;

      this.ctx.beginPath();
      this.ctx.moveTo(_coords[0], _coords[1]);
      this.ctx.lineTo(_coords[2], _coords[3]);
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
