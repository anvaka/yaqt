module.exports = intersects;

function intersects(a, b) {
  // http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
  return a.x - a.half < b.x + b.half &&
    a.x + a.half > b.x - b.half &&
    a.y - a.half < b.y + b.half &&
    a.y + a.half > b.y - b.half;
}
