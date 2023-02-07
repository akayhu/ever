export function Drag(selector, opt = {}) {
  this.dragElement =
    selector instanceof Element ? selector : document.querySelector(selector);
  this.initialPos = null;
  this.currentPos = null;
  this.rafPending = false;
  this.onDragStart = opt.onstart || null;
  this.onDragMove = opt.onmove || null;
  this.onDragEnd = opt.onend || null;

  // handle event
  this.pointerevt = {
    down: null,
    move: null,
    up: null,
    cancel: null
  };

  this._checkEventSupport();
  this.dragHandler = function(e) {
    if (e.type.includes("start") || e.type.includes("down")) {
      this.handleDragStart(e);
    } else if (e.type.includes("move")) {
      this.handleDragMove(e);
    } else {
      this.handleDragEnd(e);
    }
  }.bind(this);
  // 綁定事件
  if (!window.PointerEvent && !window.ontouchstart) {
    this.dragElement.addEventListener(
      this.pointerevt.down,
      this.dragHandler,
      true
    );
  } else {
    Object.values(this.pointerevt).forEach(evtName => {
      this.dragElement.addEventListener(evtName, this.dragHandler, true);
    });
  }
}
Drag.prototype._checkEventSupport = function() {
  if ("PointerEvent" in window) {
    this.pointerevt.down = "pointerdown";
    this.pointerevt.move = "pointermove";
    this.pointerevt.up = "pointerup";
    this.pointerevt.cancel = "pointercancel";
  } else {
    if ("ontouchstart" in window) {
      this.pointerevt.down = "touchstart";
      this.pointerevt.move = "touchmove";
      this.pointerevt.up = "touchend";
      this.pointerevt.cancel = "touchcancel";
    } else {
      this.pointerevt.down = "mousedown";
      this.pointerevt.move = "mousemove";
      this.pointerevt.up = "mouseup";
    }
  }
};
Drag.prototype.handleDragStart = function(e) {
  e.preventDefault();
  // 避開多點觸控??
  if (e.touches && e.touches.length > 1) return;
  // 如果傳進來的事件是 pointer event
  if (e.type.includes("pointer")) {
    e.target.setPointerCapture(e.pointerId);
  } else {
    // 如果不支援pointer事件且為滑鼠事件
    if (!e.targetTouches) {
      document.addEventListener(this.pointerevt.move, this.dragHandler, true);
      document.addEventListener(this.pointerevt.up, this.dragHandler, true);
    }
  }

  this.initialPos = this.getPosition(e);

  if (this.onDragStart) this.onDragStart(this.dragElement, this.initialPos);
};

Drag.prototype.handleDragMove = function(e) {
  e.preventDefault();
  if (!this.initialPos) return;
  this.currentPos = this.getPosition(e);

  if (this.rafPending) return;
  this.rafPending = window.requestAnimationFrame(this.onAnimFrame.bind(this));
};

Drag.prototype.handleDragEnd = function(e) {
  // 避開多點觸控
  if (e.touches && e.touches.length > 1) return;
  this.currentPos = this.getPosition(e);
  if (e.type.includes("pointer")) {
    e.target.releasePointerCapture(e.pointerId);
  } else {
    if (!e.targetTouches) {
      document.removeEventListener(
        this.pointerevt.move,
        this.dragHandler,
        true
      );
      document.removeEventListener(this.pointerevt.up, this.dragHandler, true);
    }
  }

  if (this.onDragEnd)
    this.onDragEnd(this.dragElement, this.currentPos, this.initialPos);
  // reset
  this.rafPending = null;
  this.initialPos = null;
};

Drag.prototype.getPosition = function(e) {
  let ref = e.targetTouches ? e.targetTouches[0] : e;
  return {
    x: ~~ref.clientX,
    y: ~~ref.clientY
  };
};

Drag.prototype.onAnimFrame = function() {
  if (!this.rafPending) return;
  if (this.onDragMove)
    this.onDragMove(this.dragElement, this.currentPos, this.initialPos);
  this.rafPending = null;
};

Drag.prototype.removeEvent = function() {
  if (!window.PointerEvent && !window.ontouchstart) {
    this.dragElement.removeEventListener(
      this.pointerevt.down,
      this.dragHandler,
      true
    );
  } else {
    Object.values(this.pointerevt).forEach(evtName => {
      this.dragElement.removeEventListener(evtName, this.dragHandler, true);
    });
  }
};

export default Drag;
