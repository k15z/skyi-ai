(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DecisionTree;

DecisionTree = (function() {
  function DecisionTree(depth, num_tries) {
    if (depth == null) {
      depth = 5;
    }
    if (num_tries == null) {
      num_tries = 10;
    }
    this.tree = {};
    this.depth = depth;
    this.num_tries = num_tries;
  }

  DecisionTree.prototype.save = function() {
    return JSON.stringify(this.tree);
  };

  DecisionTree.prototype.load = function(str) {
    return this.tree = JSON.parse(str);
  };

  DecisionTree.prototype.fit = function(x, y) {
    return this._buildTree(x, y, this.tree, this.depth);
  };

  DecisionTree.prototype.predict = function(x) {
    var j, len, x_i, y;
    y = [];
    for (j = 0, len = x.length; j < len; j++) {
      x_i = x[j];
      y.push(this.predictOne(x_i));
    }
    return y;
  };

  DecisionTree.prototype.predictOne = function(x_i) {
    var base;
    base = this.tree;
    while (!base.terminal) {
      if (x_i[base.index] < base.split) {
        base = base.left;
      } else {
        base = base.right;
      }
    }
    return base.y;
  };

  DecisionTree.prototype._buildTree = function(x, y, base, depth) {
    var best_feature_index, best_feature_split, epoch, feature_index, feature_split, greater_than_x, greater_than_y, i, impurity, j, k, less_than_x, less_than_y, lowest_impurity, num_features, num_samples, obj, ref, ref1, ref2, total;
    lowest_impurity = 10000;
    best_feature_index = 0;
    best_feature_split = 0;
    num_samples = x.length;
    num_features = x[0].length;
    for (epoch = j = 0, ref = this.num_tries; 0 <= ref ? j < ref : j > ref; epoch = 0 <= ref ? ++j : --j) {
      feature_index = this._randInt(num_features);
      feature_split = this._randSplit(x[this._randInt(num_samples)][feature_index], x[this._randInt(num_samples)][feature_index]);
      less_than_x = [];
      less_than_y = [];
      greater_than_x = [];
      greater_than_y = [];
      for (i = k = 0, ref1 = num_samples; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        if (x[i][feature_index] < feature_split) {
          less_than_x.push(x[i]);
          less_than_y.push(y[i]);
        } else {
          greater_than_x.push(x[i]);
          greater_than_y.push(y[i]);
        }
      }
      impurity = this._impurity(less_than_y) + this._impurity(greater_than_y);
      if (impurity < lowest_impurity) {
        lowest_impurity = impurity;
        best_feature_index = feature_index;
        best_feature_split = feature_split;
      }
    }
    base.impurity = lowest_impurity;
    base.index = best_feature_index;
    base.split = best_feature_split;
    if (depth > 0) {
      if (less_than_y.length > 0) {
        base.left = {};
        this._buildTree(less_than_x, less_than_y, base.left, depth - 1);
      } else {
        base.left = {};
        base.left.terminal = true;
        base.left.y = this._counter(less_than_y)[0];
      }
      if (greater_than_y.length > 0) {
        base.right = {};
        return this._buildTree(greater_than_x, greater_than_y, base.right, depth - 1);
      } else {
        base.right = {};
        base.right.terminal = true;
        return base.right.y = this._counter(greater_than_y)[0];
      }
    } else {
      ref2 = this._counter(y), obj = ref2[0], total = ref2[1];
      base.terminal = true;
      return base.y = obj;
    }
  };

  DecisionTree.prototype._randInt = function(max) {
    return parseInt(Math.random() * max);
  };

  DecisionTree.prototype._randSplit = function(a, b) {
    var p;
    p = Math.random();
    return a * p + b * (1 - p);
  };

  DecisionTree.prototype._impurity = function(y) {
    var impurity, key, obj, ref, total, value;
    ref = this._counter(y), obj = ref[0], total = ref[1];
    impurity = 1.0;
    for (key in obj) {
      value = obj[key];
      impurity -= (value / total) * (value / total);
    }
    return impurity;
  };

  DecisionTree.prototype._counter = function(y) {
    var j, label, len, obj, total;
    obj = {};
    total = 0;
    for (j = 0, len = y.length; j < len; j++) {
      label = y[j];
      if (!obj[label]) {
        obj[label] = 0;
      }
      obj[label] += 1;
      total += 1;
    }
    return [obj, total];
  };

  return DecisionTree;

})();

module.exports = DecisionTree;

},{}],2:[function(require,module,exports){
var DecisionTree, RandomForest;

DecisionTree = require('./DecisionTree');

RandomForest = (function() {
  function RandomForest(num_trees, depth) {
    if (num_trees == null) {
      num_trees = 100;
    }
    if (depth == null) {
      depth = 2;
    }
    this.trees = [];
    this.depth = depth;
    this.num_trees = num_trees;
  }

  RandomForest.prototype.save = function() {
    var j, len, ref, tree, trees;
    trees = [];
    ref = this.trees;
    for (j = 0, len = ref.length; j < len; j++) {
      tree = ref[j];
      trees.push(tree.save());
    }
    return JSON.stringify(trees);
  };

  RandomForest.prototype.load = function(str) {
    var j, len, model, models, tree, trees;
    trees = [];
    models = JSON.parse(str);
    for (j = 0, len = models.length; j < len; j++) {
      model = models[j];
      tree = new DecisionTree();
      tree.load(model);
      trees.push(tree);
    }
    return this.trees = trees;
  };

  RandomForest.prototype.fit = function(x, y, depth) {
    var i, j, ref, results, tree;
    if (depth == null) {
      depth = 3;
    }
    results = [];
    for (i = j = 0, ref = this.num_trees; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      tree = new DecisionTree(this.depth);
      this.trees.push(tree);
      results.push(tree.fit(x, y));
    }
    return results;
  };

  RandomForest.prototype.predict = function(x) {
    var j, len, x_i, y;
    y = [];
    for (j = 0, len = x.length; j < len; j++) {
      x_i = x[j];
      y.push(this.predictOne(x_i));
    }
    return y;
  };

  RandomForest.prototype.predictOne = function(x_i) {
    var j, len, ref, tree, y_i;
    y_i = [];
    ref = this.trees;
    for (j = 0, len = ref.length; j < len; j++) {
      tree = ref[j];
      y_i.push(tree.predictOne(x_i));
    }
    return this._collate(y_i);
  };

  RandomForest.prototype._collate = function(arr) {
    var acc, j, key, len, obj, value;
    acc = {};
    for (j = 0, len = arr.length; j < len; j++) {
      obj = arr[j];
      for (key in obj) {
        value = obj[key];
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += value;
      }
    }
    return acc;
  };

  return RandomForest;

})();

module.exports = RandomForest;

},{"./DecisionTree":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEZWNpc2lvblRyZWUuY29mZmVlIiwiUmFuZG9tRm9yZXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIERlY2lzaW9uVHJlZTtcblxuRGVjaXNpb25UcmVlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBEZWNpc2lvblRyZWUoZGVwdGgsIG51bV90cmllcykge1xuICAgIGlmIChkZXB0aCA9PSBudWxsKSB7XG4gICAgICBkZXB0aCA9IDU7XG4gICAgfVxuICAgIGlmIChudW1fdHJpZXMgPT0gbnVsbCkge1xuICAgICAgbnVtX3RyaWVzID0gMTA7XG4gICAgfVxuICAgIHRoaXMudHJlZSA9IHt9O1xuICAgIHRoaXMuZGVwdGggPSBkZXB0aDtcbiAgICB0aGlzLm51bV90cmllcyA9IG51bV90cmllcztcbiAgfVxuXG4gIERlY2lzaW9uVHJlZS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRyZWUpO1xuICB9O1xuXG4gIERlY2lzaW9uVHJlZS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiB0aGlzLnRyZWUgPSBKU09OLnBhcnNlKHN0cik7XG4gIH07XG5cbiAgRGVjaXNpb25UcmVlLnByb3RvdHlwZS5maXQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2J1aWxkVHJlZSh4LCB5LCB0aGlzLnRyZWUsIHRoaXMuZGVwdGgpO1xuICB9O1xuXG4gIERlY2lzaW9uVHJlZS5wcm90b3R5cGUucHJlZGljdCA9IGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgaiwgbGVuLCB4X2ksIHk7XG4gICAgeSA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHgubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHhfaSA9IHhbal07XG4gICAgICB5LnB1c2godGhpcy5wcmVkaWN0T25lKHhfaSkpO1xuICAgIH1cbiAgICByZXR1cm4geTtcbiAgfTtcblxuICBEZWNpc2lvblRyZWUucHJvdG90eXBlLnByZWRpY3RPbmUgPSBmdW5jdGlvbih4X2kpIHtcbiAgICB2YXIgYmFzZTtcbiAgICBiYXNlID0gdGhpcy50cmVlO1xuICAgIHdoaWxlICghYmFzZS50ZXJtaW5hbCkge1xuICAgICAgaWYgKHhfaVtiYXNlLmluZGV4XSA8IGJhc2Uuc3BsaXQpIHtcbiAgICAgICAgYmFzZSA9IGJhc2UubGVmdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhc2UgPSBiYXNlLnJpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmFzZS55O1xuICB9O1xuXG4gIERlY2lzaW9uVHJlZS5wcm90b3R5cGUuX2J1aWxkVHJlZSA9IGZ1bmN0aW9uKHgsIHksIGJhc2UsIGRlcHRoKSB7XG4gICAgdmFyIGJlc3RfZmVhdHVyZV9pbmRleCwgYmVzdF9mZWF0dXJlX3NwbGl0LCBlcG9jaCwgZmVhdHVyZV9pbmRleCwgZmVhdHVyZV9zcGxpdCwgZ3JlYXRlcl90aGFuX3gsIGdyZWF0ZXJfdGhhbl95LCBpLCBpbXB1cml0eSwgaiwgaywgbGVzc190aGFuX3gsIGxlc3NfdGhhbl95LCBsb3dlc3RfaW1wdXJpdHksIG51bV9mZWF0dXJlcywgbnVtX3NhbXBsZXMsIG9iaiwgcmVmLCByZWYxLCByZWYyLCB0b3RhbDtcbiAgICBsb3dlc3RfaW1wdXJpdHkgPSAxMDAwMDtcbiAgICBiZXN0X2ZlYXR1cmVfaW5kZXggPSAwO1xuICAgIGJlc3RfZmVhdHVyZV9zcGxpdCA9IDA7XG4gICAgbnVtX3NhbXBsZXMgPSB4Lmxlbmd0aDtcbiAgICBudW1fZmVhdHVyZXMgPSB4WzBdLmxlbmd0aDtcbiAgICBmb3IgKGVwb2NoID0gaiA9IDAsIHJlZiA9IHRoaXMubnVtX3RyaWVzOyAwIDw9IHJlZiA/IGogPCByZWYgOiBqID4gcmVmOyBlcG9jaCA9IDAgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBmZWF0dXJlX2luZGV4ID0gdGhpcy5fcmFuZEludChudW1fZmVhdHVyZXMpO1xuICAgICAgZmVhdHVyZV9zcGxpdCA9IHRoaXMuX3JhbmRTcGxpdCh4W3RoaXMuX3JhbmRJbnQobnVtX3NhbXBsZXMpXVtmZWF0dXJlX2luZGV4XSwgeFt0aGlzLl9yYW5kSW50KG51bV9zYW1wbGVzKV1bZmVhdHVyZV9pbmRleF0pO1xuICAgICAgbGVzc190aGFuX3ggPSBbXTtcbiAgICAgIGxlc3NfdGhhbl95ID0gW107XG4gICAgICBncmVhdGVyX3RoYW5feCA9IFtdO1xuICAgICAgZ3JlYXRlcl90aGFuX3kgPSBbXTtcbiAgICAgIGZvciAoaSA9IGsgPSAwLCByZWYxID0gbnVtX3NhbXBsZXM7IDAgPD0gcmVmMSA/IGsgPCByZWYxIDogayA+IHJlZjE7IGkgPSAwIDw9IHJlZjEgPyArK2sgOiAtLWspIHtcbiAgICAgICAgaWYgKHhbaV1bZmVhdHVyZV9pbmRleF0gPCBmZWF0dXJlX3NwbGl0KSB7XG4gICAgICAgICAgbGVzc190aGFuX3gucHVzaCh4W2ldKTtcbiAgICAgICAgICBsZXNzX3RoYW5feS5wdXNoKHlbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyZWF0ZXJfdGhhbl94LnB1c2goeFtpXSk7XG4gICAgICAgICAgZ3JlYXRlcl90aGFuX3kucHVzaCh5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaW1wdXJpdHkgPSB0aGlzLl9pbXB1cml0eShsZXNzX3RoYW5feSkgKyB0aGlzLl9pbXB1cml0eShncmVhdGVyX3RoYW5feSk7XG4gICAgICBpZiAoaW1wdXJpdHkgPCBsb3dlc3RfaW1wdXJpdHkpIHtcbiAgICAgICAgbG93ZXN0X2ltcHVyaXR5ID0gaW1wdXJpdHk7XG4gICAgICAgIGJlc3RfZmVhdHVyZV9pbmRleCA9IGZlYXR1cmVfaW5kZXg7XG4gICAgICAgIGJlc3RfZmVhdHVyZV9zcGxpdCA9IGZlYXR1cmVfc3BsaXQ7XG4gICAgICB9XG4gICAgfVxuICAgIGJhc2UuaW1wdXJpdHkgPSBsb3dlc3RfaW1wdXJpdHk7XG4gICAgYmFzZS5pbmRleCA9IGJlc3RfZmVhdHVyZV9pbmRleDtcbiAgICBiYXNlLnNwbGl0ID0gYmVzdF9mZWF0dXJlX3NwbGl0O1xuICAgIGlmIChkZXB0aCA+IDApIHtcbiAgICAgIGlmIChsZXNzX3RoYW5feS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGJhc2UubGVmdCA9IHt9O1xuICAgICAgICB0aGlzLl9idWlsZFRyZWUobGVzc190aGFuX3gsIGxlc3NfdGhhbl95LCBiYXNlLmxlZnQsIGRlcHRoIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlLmxlZnQgPSB7fTtcbiAgICAgICAgYmFzZS5sZWZ0LnRlcm1pbmFsID0gdHJ1ZTtcbiAgICAgICAgYmFzZS5sZWZ0LnkgPSB0aGlzLl9jb3VudGVyKGxlc3NfdGhhbl95KVswXTtcbiAgICAgIH1cbiAgICAgIGlmIChncmVhdGVyX3RoYW5feS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGJhc2UucmlnaHQgPSB7fTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkVHJlZShncmVhdGVyX3RoYW5feCwgZ3JlYXRlcl90aGFuX3ksIGJhc2UucmlnaHQsIGRlcHRoIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlLnJpZ2h0ID0ge307XG4gICAgICAgIGJhc2UucmlnaHQudGVybWluYWwgPSB0cnVlO1xuICAgICAgICByZXR1cm4gYmFzZS5yaWdodC55ID0gdGhpcy5fY291bnRlcihncmVhdGVyX3RoYW5feSlbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZjIgPSB0aGlzLl9jb3VudGVyKHkpLCBvYmogPSByZWYyWzBdLCB0b3RhbCA9IHJlZjJbMV07XG4gICAgICBiYXNlLnRlcm1pbmFsID0gdHJ1ZTtcbiAgICAgIHJldHVybiBiYXNlLnkgPSBvYmo7XG4gICAgfVxuICB9O1xuXG4gIERlY2lzaW9uVHJlZS5wcm90b3R5cGUuX3JhbmRJbnQgPSBmdW5jdGlvbihtYXgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gIH07XG5cbiAgRGVjaXNpb25UcmVlLnByb3RvdHlwZS5fcmFuZFNwbGl0ID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciBwO1xuICAgIHAgPSBNYXRoLnJhbmRvbSgpO1xuICAgIHJldHVybiBhICogcCArIGIgKiAoMSAtIHApO1xuICB9O1xuXG4gIERlY2lzaW9uVHJlZS5wcm90b3R5cGUuX2ltcHVyaXR5ID0gZnVuY3Rpb24oeSkge1xuICAgIHZhciBpbXB1cml0eSwga2V5LCBvYmosIHJlZiwgdG90YWwsIHZhbHVlO1xuICAgIHJlZiA9IHRoaXMuX2NvdW50ZXIoeSksIG9iaiA9IHJlZlswXSwgdG90YWwgPSByZWZbMV07XG4gICAgaW1wdXJpdHkgPSAxLjA7XG4gICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaW1wdXJpdHkgLT0gKHZhbHVlIC8gdG90YWwpICogKHZhbHVlIC8gdG90YWwpO1xuICAgIH1cbiAgICByZXR1cm4gaW1wdXJpdHk7XG4gIH07XG5cbiAgRGVjaXNpb25UcmVlLnByb3RvdHlwZS5fY291bnRlciA9IGZ1bmN0aW9uKHkpIHtcbiAgICB2YXIgaiwgbGFiZWwsIGxlbiwgb2JqLCB0b3RhbDtcbiAgICBvYmogPSB7fTtcbiAgICB0b3RhbCA9IDA7XG4gICAgZm9yIChqID0gMCwgbGVuID0geS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbGFiZWwgPSB5W2pdO1xuICAgICAgaWYgKCFvYmpbbGFiZWxdKSB7XG4gICAgICAgIG9ialtsYWJlbF0gPSAwO1xuICAgICAgfVxuICAgICAgb2JqW2xhYmVsXSArPSAxO1xuICAgICAgdG90YWwgKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIFtvYmosIHRvdGFsXTtcbiAgfTtcblxuICByZXR1cm4gRGVjaXNpb25UcmVlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlY2lzaW9uVHJlZTtcbiIsInZhciBEZWNpc2lvblRyZWUsIFJhbmRvbUZvcmVzdDtcblxuRGVjaXNpb25UcmVlID0gcmVxdWlyZSgnLi9EZWNpc2lvblRyZWUnKTtcblxuUmFuZG9tRm9yZXN0ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSYW5kb21Gb3Jlc3QobnVtX3RyZWVzLCBkZXB0aCkge1xuICAgIGlmIChudW1fdHJlZXMgPT0gbnVsbCkge1xuICAgICAgbnVtX3RyZWVzID0gMTAwO1xuICAgIH1cbiAgICBpZiAoZGVwdGggPT0gbnVsbCkge1xuICAgICAgZGVwdGggPSAyO1xuICAgIH1cbiAgICB0aGlzLnRyZWVzID0gW107XG4gICAgdGhpcy5kZXB0aCA9IGRlcHRoO1xuICAgIHRoaXMubnVtX3RyZWVzID0gbnVtX3RyZWVzO1xuICB9XG5cbiAgUmFuZG9tRm9yZXN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGosIGxlbiwgcmVmLCB0cmVlLCB0cmVlcztcbiAgICB0cmVlcyA9IFtdO1xuICAgIHJlZiA9IHRoaXMudHJlZXM7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICB0cmVlID0gcmVmW2pdO1xuICAgICAgdHJlZXMucHVzaCh0cmVlLnNhdmUoKSk7XG4gICAgfVxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0cmVlcyk7XG4gIH07XG5cbiAgUmFuZG9tRm9yZXN0LnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIGosIGxlbiwgbW9kZWwsIG1vZGVscywgdHJlZSwgdHJlZXM7XG4gICAgdHJlZXMgPSBbXTtcbiAgICBtb2RlbHMgPSBKU09OLnBhcnNlKHN0cik7XG4gICAgZm9yIChqID0gMCwgbGVuID0gbW9kZWxzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBtb2RlbCA9IG1vZGVsc1tqXTtcbiAgICAgIHRyZWUgPSBuZXcgRGVjaXNpb25UcmVlKCk7XG4gICAgICB0cmVlLmxvYWQobW9kZWwpO1xuICAgICAgdHJlZXMucHVzaCh0cmVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudHJlZXMgPSB0cmVlcztcbiAgfTtcblxuICBSYW5kb21Gb3Jlc3QucHJvdG90eXBlLmZpdCA9IGZ1bmN0aW9uKHgsIHksIGRlcHRoKSB7XG4gICAgdmFyIGksIGosIHJlZiwgcmVzdWx0cywgdHJlZTtcbiAgICBpZiAoZGVwdGggPT0gbnVsbCkge1xuICAgICAgZGVwdGggPSAzO1xuICAgIH1cbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gaiA9IDAsIHJlZiA9IHRoaXMubnVtX3RyZWVzOyAwIDw9IHJlZiA/IGogPCByZWYgOiBqID4gcmVmOyBpID0gMCA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIHRyZWUgPSBuZXcgRGVjaXNpb25UcmVlKHRoaXMuZGVwdGgpO1xuICAgICAgdGhpcy50cmVlcy5wdXNoKHRyZWUpO1xuICAgICAgcmVzdWx0cy5wdXNoKHRyZWUuZml0KHgsIHkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgUmFuZG9tRm9yZXN0LnByb3RvdHlwZS5wcmVkaWN0ID0gZnVuY3Rpb24oeCkge1xuICAgIHZhciBqLCBsZW4sIHhfaSwgeTtcbiAgICB5ID0gW107XG4gICAgZm9yIChqID0gMCwgbGVuID0geC5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgeF9pID0geFtqXTtcbiAgICAgIHkucHVzaCh0aGlzLnByZWRpY3RPbmUoeF9pKSk7XG4gICAgfVxuICAgIHJldHVybiB5O1xuICB9O1xuXG4gIFJhbmRvbUZvcmVzdC5wcm90b3R5cGUucHJlZGljdE9uZSA9IGZ1bmN0aW9uKHhfaSkge1xuICAgIHZhciBqLCBsZW4sIHJlZiwgdHJlZSwgeV9pO1xuICAgIHlfaSA9IFtdO1xuICAgIHJlZiA9IHRoaXMudHJlZXM7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICB0cmVlID0gcmVmW2pdO1xuICAgICAgeV9pLnB1c2godHJlZS5wcmVkaWN0T25lKHhfaSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29sbGF0ZSh5X2kpO1xuICB9O1xuXG4gIFJhbmRvbUZvcmVzdC5wcm90b3R5cGUuX2NvbGxhdGUgPSBmdW5jdGlvbihhcnIpIHtcbiAgICB2YXIgYWNjLCBqLCBrZXksIGxlbiwgb2JqLCB2YWx1ZTtcbiAgICBhY2MgPSB7fTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG9iaiA9IGFycltqXTtcbiAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgICBpZiAoIWFjY1trZXldKSB7XG4gICAgICAgICAgYWNjW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGFjY1trZXldICs9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYWNjO1xuICB9O1xuXG4gIHJldHVybiBSYW5kb21Gb3Jlc3Q7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tRm9yZXN0O1xuIl19
