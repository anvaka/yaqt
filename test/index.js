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


test('it can init tree asynchronously', function(t) {
  var tree = quadTree();
  // points are array of [x1, y1, x2, y2, ...];
  var points = [-10, -10, 10, 10];
  tree.initAsync(points, {
    done() {
      var bounds = tree.bounds();
      t.ok(bounds.left() <= -10, 'left boundary is ok');
      t.ok(bounds.top()  <= -10, 'top boundary is ok');
      t.ok(bounds.width() >=  20, 'width is ok');
      t.ok(bounds.height() >= 20, 'height is ok');
      t.end();
    }
  })
});

test('it can query range', function(t) {
  var tree = quadTree();
  // points are array of [x1, y1, x2, y2, ...];
  var points = [-10, -10, 10, 10];
  tree.init(points);
  var x = 9, y = 9, squareSize = 2;
  var indices = tree.pointsAround(x, y, squareSize);
  t.equals(indices.length, 1, 'Found exactly one point');
  t.equals(indices[0], 2, 'And that point is 10, 10');
  t.end();
});

test('it can query large data set', function(t) {
  var tree = quadTree();
  // Let's create a dataset with two clusters, with 100 points in each
  var points = [];
  for (var i = 0; i < 100; ++i) {
    points.push(-9.5 - Math.random(), -9.5 - Math.random());
    points.push(9.5 + Math.random(), 9.5 + Math.random());
  }

  tree.init(points);
  var x = 9, y = 9, squareSize = 2;
  var indices = tree.pointsAround(x, y, squareSize);

  t.equals(indices.length, 100, 'All points in the positive cluster are found');
  for (i = 0; i < indices.length; ++i) {
    x = points[indices[i]];
    y = points[indices[i] + 1];
    t.ok(x >= 9 && y >= 9, 'The cluster is positive');
  }

  // this should not return anything:
  x = 0; y = 0; squareSize = 2;
  indices = tree.pointsAround(x, y, squareSize);
  t.equals(indices.length, 0, 'No points around this area');

  // Finally, let's check negative as well:
  x = -9; y = -9; squareSize = 2;
  indices = tree.pointsAround(x, y, squareSize);
  t.equals(indices.length, 100, 'All negative poitns found');

  for (i = 0; i < indices.length; ++i) {
    x = points[indices[i]];
    y = points[indices[i] + 1];
    t.ok(x <= -9 && y <=  -9, 'The cluster is negative');
  }

  t.end();
});
