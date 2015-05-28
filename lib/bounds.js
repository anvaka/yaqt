module.exports = Bounds;

function Bounds(x, y, half) {
  this.x = typeof x === 'number' ? x : 0;
  this.y = typeof y === 'number' ? y : 0;
  this.half = typeof half === 'number' ? half : 0;
}

Bounds.prototype.left = function left() {
  return this.x - this.half;
};

Bounds.prototype.top = function top() {
  return this.y - this.half;
};

Bounds.prototype.width = function width() {
  return this.half * 2;
};

Bounds.prototype.height = function height() {
  return this.half * 2;
};

Bounds.prototype.centerX = function cx() {
  return this.x;
};

Bounds.prototype.centerY = function cy() {
  return this.y;
};

Bounds.prototype.contains = function contains(x, y) {
  var half = this.half;
  return this.x - half <= x && x < this.x + half &&
         this.y - half <= y && y < this.y + half;
};

Bounds.prototype.intersects = function intersects(other) {
  // http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
  return this.x - this.half < other.x + other.half &&
    this.x + this.half > other.x - other.half &&
    this.y - this.half < other.y + other.half &&
    this.y + this.half > other.y - other.half;
};

