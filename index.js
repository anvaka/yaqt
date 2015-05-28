var Bounds = require('./lib/bounds.js');
var TreeNode = require('./lib/treeNode.js');
var EmptyRegion = new Bounds();

module.exports = createTree;

function createTree(options) {
  options = options || {};

  var root;
  var api = {
    init: init,
    bounds: getBounds
  };

  return api;

  function init(points) {
    if (!points) throw new Error('Points array is required for quadtree to work');
    if (typeof points.length !== 'number') throw new Error('Points should be array-like object');
    if (points.length % 2 !== 0) throw new Error('Points array should consist of series of x,y coordinates and be multiple of 2');
    root = createRootNode(points);
  }

  function getBounds() {
    if (!root) return EmptyRegion;
    return root.bounds;
  }

  function createRootNode(points) {
    // Edge case deserves empty region:
    if (points.length === 0) {
      var empty = new Bounds();
      return new TreeNode(empty);
    }

    // Otherwise let's figure out how big should be the root region
    var minX = Number.POSITIVE_INFINITY;
    var minY = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    var maxY = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < points.length; i += 2) {
      var x = points[i], y = points[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    // Make bounds square:
    var side = Math.max(maxX - minX, maxY - minY);
    // since we need to have both sides inside the area, let's artificially
    // grow the root region:
    side += 2;
    minX -= 1;
    minY -= 1;
    var half = side/2;

    var bounds = new Bounds(minX + half, minY + half, half);
    return new TreeNode(bounds);
  }
}
