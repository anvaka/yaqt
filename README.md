# yaqt

Yet another quad tree. API is not finished. Just a test. You can see  [yaot](https://github.com/anvaka/yaot)
for 3D oct-tree, which is used and better documented.

# usage

These notes are for myself:

```
npm install https://github.com/anvaka/yaqt
```

``` js
// First we need to create the tree:
var createTree = require('yaqt');

var tree = createTree();
var points = [
  0, 0, // First point at 0, 0, 0
  10, 0 // second point at 10, 0, 0
]
tree.init(points);

tree.pointsAround(
  5 // x center of the square
  5 // y center of the square,
  6 // half width of the square
);
// this will return indices 0 and 2 of the origina poitns array, since both 0, 0
// and 10, 0 ar lying within requested sqare
```


# license

MIT
