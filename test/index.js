var test = require('tap').test;
var quadTree = require('../index.js');

test('it can detect boundaries', function(t) {
  var tree = quadTree();
  // points are array of [x1, y1, x2, y2, ...];
  var points = [-10, -10, 10, 10];
  tree.init(points);
  var bounds = tree.bounds();
  t.ok(bounds.left() <= -10, 'left boundary is ok');
  t.ok(bounds.top()  <= -10, 'top boundary is ok');
  t.ok(bounds.width() >=  20, 'width is ok');
  t.ok(bounds.height() >= 20, 'height is ok');
  t.end();
});
