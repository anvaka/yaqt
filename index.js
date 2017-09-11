var Bounds = require('./lib/bounds.js');
var TreeNode = require('./lib/treeNode.js');
var EmptyRegion = new Bounds();
var rectangularCheck = require('./lib/rectangularCheck.js');
var asyncFor = require('rafor');

module.exports = createTree;

function createTree() {
  var queryBounds = new Bounds();
  var root;
  var originalArray;
  var api = {

    /**
     * Synchronous version of `initAsync()`. Should only be used for small
     * trees (less than 50-70k of points).
     *
     * @param {number[]} points array of points for which we are building the
     * tree. Flat sequence of (x, y) coordinates. Array length should be
     * multiple of 2.
     */
    init: init,

    /**
     * Initializes tree asynchronously. Very useful when you have millions
     * of points and do not want to block rendering thread for too long.
     *
     * @param {number[]} points array of points for which we are building the
     * tree. Flat sequence of (x, y) coordinates. Array length should be
     * multiple of 2.
     *
     * @param {Function=} doneCallback called when tree is initialized. The
     * callback will be called with single argument which represent current
     * tree.
     */
    initAsync: initAsync,
    bounds: getBounds,
    pointsAround: getPointsAround,
    visit: visit
  };

  return api;

  function visit(cb) {
    return root.visit(cb);
  }

  function getPointsAround(x, y, half, intersectCheck) {
    if (typeof intersectCheck !== 'function') {
      intersectCheck = rectangularCheck;
    }
    var indices = [];
    queryBounds.x = x;
    queryBounds.y = y;
    queryBounds.half = half;
    root.query(queryBounds, indices, originalArray, intersectCheck);
    return indices;
  }

  function init(points) {
    verifyPointsInvariant(points);

    originalArray = points;
    root = createRootNode(points);
    for (var i = 0; i < points.length; i += 2) {
      root.insert(i, originalArray);
    }
  }

  function initAsync(points, options) {
    verifyPointsInvariant(points);

    var doneCallback = options && options.done;
    var progress = options && options.progress;

    root = createRootNode(points);
    originalArray = points;
    asyncFor(points, insertToRoot, doneInternal, { step: 2 });

    function insertToRoot(element, i) {
      root.insert(i, points, 0);
      if (progress) progress(i, points.length);
    }

    function doneInternal() {
      if (typeof doneCallback === 'function') {
        doneCallback(api);
      }
    }
  }

  function verifyPointsInvariant(points) {
    if (!points) throw new Error('Points array is required for quadtree to work');
    if (typeof points.length !== 'number') throw new Error('Points should be array-like object');
    if (points.length % 2 !== 0) throw new Error('Points array should consist of series of x,y coordinates and be multiple of 2');
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
