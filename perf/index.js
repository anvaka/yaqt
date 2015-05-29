var random = require('ngraph.random').random(42);
var Benchmark = require('benchmark');
var createTree = require('../index.js');
var points = 10000;

console.log(process.versions);
console.log('points #' + points);
var suite = new Benchmark.Suite;

// add tests
suite.add('Init speed', function() {
  var quadTree = createTree();
  var points = createPoints();
  quadTree.init(points);
})
.add('intersect query', function() {
  var quadTree = createTree();
  var points = createPoints();
  quadTree.init(points);
  var x = points - random.next(points) * 2;
  var y = points - random.next(points) * 2;
  var size = random.next(points * 0.01);

  quadTree.pointsAround(x, y, size);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
// run async
.run({ 'async': true });

function createPoints() {
  var array = [];
  for (var i = 0; i < points; ++i) {
    array.push(points - 2 * random.next(points), points - 2 * random.next(points));
  }
  return array;
}
