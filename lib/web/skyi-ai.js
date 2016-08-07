(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DecisionTree;

DecisionTree = (function() {
  function DecisionTree(opts) {
    if (opts == null) {
      opts = {};
    }
    this._tree = {};
    this._score = false;
    this._max_depth = opts.max_depth ? opts.max_depth : 32;
    this._num_tries = opts.num_tries ? opts.num_tries : 16;
  }

  DecisionTree.prototype.save = function() {
    return this._tree;
  };

  DecisionTree.prototype.load = function(tree) {
    return this._tree = tree;
  };

  DecisionTree.prototype.fit = function(x, y) {
    this._build_node(x, y, this._tree, this._max_depth);
    return this._score = this.score(x, y);
  };

  DecisionTree.prototype.score = function(x, y) {
    var best_count, best_label, count, i, j, label, output, ref, ref1, right, total;
    right = 0;
    total = 0;
    output = this.predict(x);
    for (i = j = 0, ref = output.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      best_count = 0;
      best_label = false;
      ref1 = output[i];
      for (label in ref1) {
        count = ref1[label];
        if (count > best_count) {
          best_count = count;
          best_label = label;
        }
      }
      if (best_label + "" === y[i] + "") {
        right++;
      }
      total++;
    }
    return right / total;
  };

  DecisionTree.prototype.predict = function(x) {
    var j, len, x_i, y;
    y = [];
    for (j = 0, len = x.length; j < len; j++) {
      x_i = x[j];
      y.push(this.predict_one(x_i));
    }
    return y;
  };

  DecisionTree.prototype.predict_one = function(x_i) {
    var base;
    base = this._tree;
    while (base && !base.leaf) {
      if (x_i[base.index] < base.split) {
        base = base.left;
      } else {
        base = base.right;
      }
    }
    if (!base) {
      return {};
    }
    return base.distribution;
  };

  DecisionTree.prototype._build_node = function(x, y, node, depth) {
    var best, obj, ref, total;
    ref = this._count(y), obj = ref[0], total = ref[1];
    if (depth === 0 || Object.keys(obj).length <= 1) {
      node.leaf = true;
      node.total = total;
      return node.distribution = obj;
    } else {
      best = this._select_split(x, y);
      node.index = best.index;
      node.split = best.split;
      node.left = {};
      this._build_node(best.left_x, best.left_y, node.left, depth - 1);
      node.right = {};
      return this._build_node(best.right_x, best.right_y, node.right, depth - 1);
    }
  };

  DecisionTree.prototype._select_split = function(x, y) {
    var best, current, i, j, k, num_features, num_samples, ref, ref1, trie;
    num_samples = x.length;
    num_features = x[0].length;
    best = {
      impurity: Number.MAX_SAFE_INTEGER,
      index: -1,
      split: -1,
      left_x: [],
      left_y: [],
      right_x: [],
      right_y: []
    };
    for (trie = j = 0, ref = this._num_tries; 0 <= ref ? j < ref : j > ref; trie = 0 <= ref ? ++j : --j) {
      current = {};
      current.impurity = 0;
      current.index = this._rand_int(num_features);
      current.split = this._rand_float(x[this._rand_int(num_samples)][current.index], x[this._rand_int(num_samples)][current.index]);
      current.left_x = [];
      current.left_y = [];
      current.right_x = [];
      current.right_y = [];
      for (i = k = 0, ref1 = num_samples; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        if (x[i][current.index] < current.split) {
          current.left_x.push(x[i]);
          current.left_y.push(y[i]);
        } else {
          current.right_x.push(x[i]);
          current.right_y.push(y[i]);
        }
      }
      current.impurity = this._impurity(current.left_y) + this._impurity(current.right_y);
      if (current.impurity < best.impurity) {
        best = current;
      }
    }
    return best;
  };

  DecisionTree.prototype._rand_int = function(max) {
    var value;
    value = Math.random() * max;
    return Math.floor(value);
  };

  DecisionTree.prototype._rand_float = function(a, b) {
    var p;
    p = Math.random();
    return a * p + b * (1 - p);
  };

  DecisionTree.prototype._count = function(y) {
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

  DecisionTree.prototype._impurity = function(y) {
    var impurity, key, obj, ref, total, value;
    impurity = 1.0;
    ref = this._count(y), obj = ref[0], total = ref[1];
    for (key in obj) {
      value = obj[key];
      impurity -= (value / total) * (value / total);
    }
    return impurity;
  };

  return DecisionTree;

})();

module.exports = DecisionTree;

},{}],2:[function(require,module,exports){
var DecisionTree, RandomForest;

DecisionTree = require('./DecisionTree');

RandomForest = (function() {
  function RandomForest(opts) {
    if (opts == null) {
      opts = {};
    }
    this._trees = [];
    this._opts = opts;
    this._verbose = opts.verbose ? opts.verbose : false;
    this._num_trees = opts.num_trees ? opts.num_trees : 8;
    this._num_folds = opts.num_folds ? opts.num_folds : 1;
    this._redundancy = opts.redundancy ? opts.redundancy : 1;
  }

  RandomForest.prototype.save = function() {
    var k, len, ref, tree, trees;
    trees = [];
    ref = this._trees;
    for (k = 0, len = ref.length; k < len; k++) {
      tree = ref[k];
      trees.push(tree.save());
    }
    return trees;
  };

  RandomForest.prototype.load = function(trees) {
    var _tree, _trees, k, len, tree;
    _trees = [];
    for (k = 0, len = trees.length; k < len; k++) {
      tree = trees[k];
      _tree = new DecisionTree();
      _tree.load(tree);
      _trees.push(_tree);
    }
    return this._trees = _trees;
  };

  RandomForest.prototype.fit = function(x, y) {
    var i, j, k, l, num_subset, ref, ref1, sub_x, sub_y, tree;
    for (i = k = 0, ref = this._num_trees * this._redundancy; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      if (this._verbose) {
        console.log("building tree " + i + "...");
      }
      sub_x = [];
      sub_y = [];
      tree = new DecisionTree(this._opts);
      num_subset = Math.floor(x.length / this._num_folds);
      for (i = l = 0, ref1 = num_subset; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
        j = parseInt(Math.random() * x.length);
        sub_x.push(x[j]);
        sub_y.push(y[j]);
      }
      tree.fit(sub_x, sub_y);
      this._trees.push(tree);
    }
    this._trees.sort(function(a, b) {
      return b._score - a._score;
    });
    return this._trees.splice(this._num_trees);
  };

  RandomForest.prototype.score = function(x, y) {
    var best_label, best_score, i, k, label, output, ref, ref1, right, score, total;
    right = 0;
    total = 0;
    output = this.predict(x);
    for (i = k = 0, ref = output.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      best_score = 0;
      best_label = false;
      ref1 = output[i];
      for (label in ref1) {
        score = ref1[label];
        if (score > best_score) {
          best_score = score;
          best_label = label;
        }
      }
      if (best_label === y[i]) {
        right++;
      }
      total++;
    }
    return right / total;
  };

  RandomForest.prototype.predict = function(x) {
    var k, len, x_i, y;
    y = [];
    for (k = 0, len = x.length; k < len; k++) {
      x_i = x[k];
      y.push(this.predict_one(x_i));
    }
    return y;
  };

  RandomForest.prototype.predict_one = function(x_i) {
    var k, len, ref, tree, y_i;
    y_i = [];
    ref = this._trees;
    for (k = 0, len = ref.length; k < len; k++) {
      tree = ref[k];
      y_i.push(tree.predict_one(x_i));
    }
    return this._collate(y_i);
  };

  RandomForest.prototype._collate = function(arr) {
    var acc, i, k, key, ref, ref1, value;
    acc = {};
    for (i = k = 0, ref = arr.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      ref1 = arr[i];
      for (key in ref1) {
        value = ref1[key];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEZWNpc2lvblRyZWUuY29mZmVlIiwiUmFuZG9tRm9yZXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRGVjaXNpb25UcmVlO1xuXG5EZWNpc2lvblRyZWUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIERlY2lzaW9uVHJlZShvcHRzKSB7XG4gICAgaWYgKG9wdHMgPT0gbnVsbCkge1xuICAgICAgb3B0cyA9IHt9O1xuICAgIH1cbiAgICB0aGlzLl90cmVlID0ge307XG4gICAgdGhpcy5fc2NvcmUgPSBmYWxzZTtcbiAgICB0aGlzLl9tYXhfZGVwdGggPSBvcHRzLm1heF9kZXB0aCA/IG9wdHMubWF4X2RlcHRoIDogMzI7XG4gICAgdGhpcy5fbnVtX3RyaWVzID0gb3B0cy5udW1fdHJpZXMgPyBvcHRzLm51bV90cmllcyA6IDE2O1xuICB9XG5cbiAgRGVjaXNpb25UcmVlLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyZWU7XG4gIH07XG5cbiAgRGVjaXNpb25UcmVlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24odHJlZSkge1xuICAgIHJldHVybiB0aGlzLl90cmVlID0gdHJlZTtcbiAgfTtcblxuICBEZWNpc2lvblRyZWUucHJvdG90eXBlLmZpdCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB0aGlzLl9idWlsZF9ub2RlKHgsIHksIHRoaXMuX3RyZWUsIHRoaXMuX21heF9kZXB0aCk7XG4gICAgcmV0dXJuIHRoaXMuX3Njb3JlID0gdGhpcy5zY29yZSh4LCB5KTtcbiAgfTtcblxuICBEZWNpc2lvblRyZWUucHJvdG90eXBlLnNjb3JlID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciBiZXN0X2NvdW50LCBiZXN0X2xhYmVsLCBjb3VudCwgaSwgaiwgbGFiZWwsIG91dHB1dCwgcmVmLCByZWYxLCByaWdodCwgdG90YWw7XG4gICAgcmlnaHQgPSAwO1xuICAgIHRvdGFsID0gMDtcbiAgICBvdXRwdXQgPSB0aGlzLnByZWRpY3QoeCk7XG4gICAgZm9yIChpID0gaiA9IDAsIHJlZiA9IG91dHB1dC5sZW5ndGg7IDAgPD0gcmVmID8gaiA8IHJlZiA6IGogPiByZWY7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgYmVzdF9jb3VudCA9IDA7XG4gICAgICBiZXN0X2xhYmVsID0gZmFsc2U7XG4gICAgICByZWYxID0gb3V0cHV0W2ldO1xuICAgICAgZm9yIChsYWJlbCBpbiByZWYxKSB7XG4gICAgICAgIGNvdW50ID0gcmVmMVtsYWJlbF07XG4gICAgICAgIGlmIChjb3VudCA+IGJlc3RfY291bnQpIHtcbiAgICAgICAgICBiZXN0X2NvdW50ID0gY291bnQ7XG4gICAgICAgICAgYmVzdF9sYWJlbCA9IGxhYmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoYmVzdF9sYWJlbCArIFwiXCIgPT09IHlbaV0gKyBcIlwiKSB7XG4gICAgICAgIHJpZ2h0Kys7XG4gICAgICB9XG4gICAgICB0b3RhbCsrO1xuICAgIH1cbiAgICByZXR1cm4gcmlnaHQgLyB0b3RhbDtcbiAgfTtcblxuICBEZWNpc2lvblRyZWUucHJvdG90eXBlLnByZWRpY3QgPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIGosIGxlbiwgeF9pLCB5O1xuICAgIHkgPSBbXTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSB4Lmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICB4X2kgPSB4W2pdO1xuICAgICAgeS5wdXNoKHRoaXMucHJlZGljdF9vbmUoeF9pKSk7XG4gICAgfVxuICAgIHJldHVybiB5O1xuICB9O1xuXG4gIERlY2lzaW9uVHJlZS5wcm90b3R5cGUucHJlZGljdF9vbmUgPSBmdW5jdGlvbih4X2kpIHtcbiAgICB2YXIgYmFzZTtcbiAgICBiYXNlID0gdGhpcy5fdHJlZTtcbiAgICB3aGlsZSAoYmFzZSAmJiAhYmFzZS5sZWFmKSB7XG4gICAgICBpZiAoeF9pW2Jhc2UuaW5kZXhdIDwgYmFzZS5zcGxpdCkge1xuICAgICAgICBiYXNlID0gYmFzZS5sZWZ0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZSA9IGJhc2UucmlnaHQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghYmFzZSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICByZXR1cm4gYmFzZS5kaXN0cmlidXRpb247XG4gIH07XG5cbiAgRGVjaXNpb25UcmVlLnByb3RvdHlwZS5fYnVpbGRfbm9kZSA9IGZ1bmN0aW9uKHgsIHksIG5vZGUsIGRlcHRoKSB7XG4gICAgdmFyIGJlc3QsIG9iaiwgcmVmLCB0b3RhbDtcbiAgICByZWYgPSB0aGlzLl9jb3VudCh5KSwgb2JqID0gcmVmWzBdLCB0b3RhbCA9IHJlZlsxXTtcbiAgICBpZiAoZGVwdGggPT09IDAgfHwgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPD0gMSkge1xuICAgICAgbm9kZS5sZWFmID0gdHJ1ZTtcbiAgICAgIG5vZGUudG90YWwgPSB0b3RhbDtcbiAgICAgIHJldHVybiBub2RlLmRpc3RyaWJ1dGlvbiA9IG9iajtcbiAgICB9IGVsc2Uge1xuICAgICAgYmVzdCA9IHRoaXMuX3NlbGVjdF9zcGxpdCh4LCB5KTtcbiAgICAgIG5vZGUuaW5kZXggPSBiZXN0LmluZGV4O1xuICAgICAgbm9kZS5zcGxpdCA9IGJlc3Quc3BsaXQ7XG4gICAgICBub2RlLmxlZnQgPSB7fTtcbiAgICAgIHRoaXMuX2J1aWxkX25vZGUoYmVzdC5sZWZ0X3gsIGJlc3QubGVmdF95LCBub2RlLmxlZnQsIGRlcHRoIC0gMSk7XG4gICAgICBub2RlLnJpZ2h0ID0ge307XG4gICAgICByZXR1cm4gdGhpcy5fYnVpbGRfbm9kZShiZXN0LnJpZ2h0X3gsIGJlc3QucmlnaHRfeSwgbm9kZS5yaWdodCwgZGVwdGggLSAxKTtcbiAgICB9XG4gIH07XG5cbiAgRGVjaXNpb25UcmVlLnByb3RvdHlwZS5fc2VsZWN0X3NwbGl0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciBiZXN0LCBjdXJyZW50LCBpLCBqLCBrLCBudW1fZmVhdHVyZXMsIG51bV9zYW1wbGVzLCByZWYsIHJlZjEsIHRyaWU7XG4gICAgbnVtX3NhbXBsZXMgPSB4Lmxlbmd0aDtcbiAgICBudW1fZmVhdHVyZXMgPSB4WzBdLmxlbmd0aDtcbiAgICBiZXN0ID0ge1xuICAgICAgaW1wdXJpdHk6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgICAgaW5kZXg6IC0xLFxuICAgICAgc3BsaXQ6IC0xLFxuICAgICAgbGVmdF94OiBbXSxcbiAgICAgIGxlZnRfeTogW10sXG4gICAgICByaWdodF94OiBbXSxcbiAgICAgIHJpZ2h0X3k6IFtdXG4gICAgfTtcbiAgICBmb3IgKHRyaWUgPSBqID0gMCwgcmVmID0gdGhpcy5fbnVtX3RyaWVzOyAwIDw9IHJlZiA/IGogPCByZWYgOiBqID4gcmVmOyB0cmllID0gMCA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGN1cnJlbnQgPSB7fTtcbiAgICAgIGN1cnJlbnQuaW1wdXJpdHkgPSAwO1xuICAgICAgY3VycmVudC5pbmRleCA9IHRoaXMuX3JhbmRfaW50KG51bV9mZWF0dXJlcyk7XG4gICAgICBjdXJyZW50LnNwbGl0ID0gdGhpcy5fcmFuZF9mbG9hdCh4W3RoaXMuX3JhbmRfaW50KG51bV9zYW1wbGVzKV1bY3VycmVudC5pbmRleF0sIHhbdGhpcy5fcmFuZF9pbnQobnVtX3NhbXBsZXMpXVtjdXJyZW50LmluZGV4XSk7XG4gICAgICBjdXJyZW50LmxlZnRfeCA9IFtdO1xuICAgICAgY3VycmVudC5sZWZ0X3kgPSBbXTtcbiAgICAgIGN1cnJlbnQucmlnaHRfeCA9IFtdO1xuICAgICAgY3VycmVudC5yaWdodF95ID0gW107XG4gICAgICBmb3IgKGkgPSBrID0gMCwgcmVmMSA9IG51bV9zYW1wbGVzOyAwIDw9IHJlZjEgPyBrIDwgcmVmMSA6IGsgPiByZWYxOyBpID0gMCA8PSByZWYxID8gKytrIDogLS1rKSB7XG4gICAgICAgIGlmICh4W2ldW2N1cnJlbnQuaW5kZXhdIDwgY3VycmVudC5zcGxpdCkge1xuICAgICAgICAgIGN1cnJlbnQubGVmdF94LnB1c2goeFtpXSk7XG4gICAgICAgICAgY3VycmVudC5sZWZ0X3kucHVzaCh5W2ldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyZW50LnJpZ2h0X3gucHVzaCh4W2ldKTtcbiAgICAgICAgICBjdXJyZW50LnJpZ2h0X3kucHVzaCh5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY3VycmVudC5pbXB1cml0eSA9IHRoaXMuX2ltcHVyaXR5KGN1cnJlbnQubGVmdF95KSArIHRoaXMuX2ltcHVyaXR5KGN1cnJlbnQucmlnaHRfeSk7XG4gICAgICBpZiAoY3VycmVudC5pbXB1cml0eSA8IGJlc3QuaW1wdXJpdHkpIHtcbiAgICAgICAgYmVzdCA9IGN1cnJlbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiZXN0O1xuICB9O1xuXG4gIERlY2lzaW9uVHJlZS5wcm90b3R5cGUuX3JhbmRfaW50ID0gZnVuY3Rpb24obWF4KSB7XG4gICAgdmFyIHZhbHVlO1xuICAgIHZhbHVlID0gTWF0aC5yYW5kb20oKSAqIG1heDtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSk7XG4gIH07XG5cbiAgRGVjaXNpb25UcmVlLnByb3RvdHlwZS5fcmFuZF9mbG9hdCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gTWF0aC5yYW5kb20oKTtcbiAgICByZXR1cm4gYSAqIHAgKyBiICogKDEgLSBwKTtcbiAgfTtcblxuICBEZWNpc2lvblRyZWUucHJvdG90eXBlLl9jb3VudCA9IGZ1bmN0aW9uKHkpIHtcbiAgICB2YXIgaiwgbGFiZWwsIGxlbiwgb2JqLCB0b3RhbDtcbiAgICBvYmogPSB7fTtcbiAgICB0b3RhbCA9IDA7XG4gICAgZm9yIChqID0gMCwgbGVuID0geS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbGFiZWwgPSB5W2pdO1xuICAgICAgaWYgKCFvYmpbbGFiZWxdKSB7XG4gICAgICAgIG9ialtsYWJlbF0gPSAwO1xuICAgICAgfVxuICAgICAgb2JqW2xhYmVsXSArPSAxO1xuICAgICAgdG90YWwgKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIFtvYmosIHRvdGFsXTtcbiAgfTtcblxuICBEZWNpc2lvblRyZWUucHJvdG90eXBlLl9pbXB1cml0eSA9IGZ1bmN0aW9uKHkpIHtcbiAgICB2YXIgaW1wdXJpdHksIGtleSwgb2JqLCByZWYsIHRvdGFsLCB2YWx1ZTtcbiAgICBpbXB1cml0eSA9IDEuMDtcbiAgICByZWYgPSB0aGlzLl9jb3VudCh5KSwgb2JqID0gcmVmWzBdLCB0b3RhbCA9IHJlZlsxXTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgIHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpbXB1cml0eSAtPSAodmFsdWUgLyB0b3RhbCkgKiAodmFsdWUgLyB0b3RhbCk7XG4gICAgfVxuICAgIHJldHVybiBpbXB1cml0eTtcbiAgfTtcblxuICByZXR1cm4gRGVjaXNpb25UcmVlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlY2lzaW9uVHJlZTtcbiIsInZhciBEZWNpc2lvblRyZWUsIFJhbmRvbUZvcmVzdDtcblxuRGVjaXNpb25UcmVlID0gcmVxdWlyZSgnLi9EZWNpc2lvblRyZWUnKTtcblxuUmFuZG9tRm9yZXN0ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSYW5kb21Gb3Jlc3Qob3B0cykge1xuICAgIGlmIChvcHRzID09IG51bGwpIHtcbiAgICAgIG9wdHMgPSB7fTtcbiAgICB9XG4gICAgdGhpcy5fdHJlZXMgPSBbXTtcbiAgICB0aGlzLl9vcHRzID0gb3B0cztcbiAgICB0aGlzLl92ZXJib3NlID0gb3B0cy52ZXJib3NlID8gb3B0cy52ZXJib3NlIDogZmFsc2U7XG4gICAgdGhpcy5fbnVtX3RyZWVzID0gb3B0cy5udW1fdHJlZXMgPyBvcHRzLm51bV90cmVlcyA6IDg7XG4gICAgdGhpcy5fbnVtX2ZvbGRzID0gb3B0cy5udW1fZm9sZHMgPyBvcHRzLm51bV9mb2xkcyA6IDE7XG4gICAgdGhpcy5fcmVkdW5kYW5jeSA9IG9wdHMucmVkdW5kYW5jeSA/IG9wdHMucmVkdW5kYW5jeSA6IDE7XG4gIH1cblxuICBSYW5kb21Gb3Jlc3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaywgbGVuLCByZWYsIHRyZWUsIHRyZWVzO1xuICAgIHRyZWVzID0gW107XG4gICAgcmVmID0gdGhpcy5fdHJlZXM7XG4gICAgZm9yIChrID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgayA8IGxlbjsgaysrKSB7XG4gICAgICB0cmVlID0gcmVmW2tdO1xuICAgICAgdHJlZXMucHVzaCh0cmVlLnNhdmUoKSk7XG4gICAgfVxuICAgIHJldHVybiB0cmVlcztcbiAgfTtcblxuICBSYW5kb21Gb3Jlc3QucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih0cmVlcykge1xuICAgIHZhciBfdHJlZSwgX3RyZWVzLCBrLCBsZW4sIHRyZWU7XG4gICAgX3RyZWVzID0gW107XG4gICAgZm9yIChrID0gMCwgbGVuID0gdHJlZXMubGVuZ3RoOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgIHRyZWUgPSB0cmVlc1trXTtcbiAgICAgIF90cmVlID0gbmV3IERlY2lzaW9uVHJlZSgpO1xuICAgICAgX3RyZWUubG9hZCh0cmVlKTtcbiAgICAgIF90cmVlcy5wdXNoKF90cmVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RyZWVzID0gX3RyZWVzO1xuICB9O1xuXG4gIFJhbmRvbUZvcmVzdC5wcm90b3R5cGUuZml0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciBpLCBqLCBrLCBsLCBudW1fc3Vic2V0LCByZWYsIHJlZjEsIHN1Yl94LCBzdWJfeSwgdHJlZTtcbiAgICBmb3IgKGkgPSBrID0gMCwgcmVmID0gdGhpcy5fbnVtX3RyZWVzICogdGhpcy5fcmVkdW5kYW5jeTsgMCA8PSByZWYgPyBrIDwgcmVmIDogayA+IHJlZjsgaSA9IDAgPD0gcmVmID8gKytrIDogLS1rKSB7XG4gICAgICBpZiAodGhpcy5fdmVyYm9zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImJ1aWxkaW5nIHRyZWUgXCIgKyBpICsgXCIuLi5cIik7XG4gICAgICB9XG4gICAgICBzdWJfeCA9IFtdO1xuICAgICAgc3ViX3kgPSBbXTtcbiAgICAgIHRyZWUgPSBuZXcgRGVjaXNpb25UcmVlKHRoaXMuX29wdHMpO1xuICAgICAgbnVtX3N1YnNldCA9IE1hdGguZmxvb3IoeC5sZW5ndGggLyB0aGlzLl9udW1fZm9sZHMpO1xuICAgICAgZm9yIChpID0gbCA9IDAsIHJlZjEgPSBudW1fc3Vic2V0OyAwIDw9IHJlZjEgPyBsIDwgcmVmMSA6IGwgPiByZWYxOyBpID0gMCA8PSByZWYxID8gKytsIDogLS1sKSB7XG4gICAgICAgIGogPSBwYXJzZUludChNYXRoLnJhbmRvbSgpICogeC5sZW5ndGgpO1xuICAgICAgICBzdWJfeC5wdXNoKHhbal0pO1xuICAgICAgICBzdWJfeS5wdXNoKHlbal0pO1xuICAgICAgfVxuICAgICAgdHJlZS5maXQoc3ViX3gsIHN1Yl95KTtcbiAgICAgIHRoaXMuX3RyZWVzLnB1c2godHJlZSk7XG4gICAgfVxuICAgIHRoaXMuX3RyZWVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGIuX3Njb3JlIC0gYS5fc2NvcmU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuX3RyZWVzLnNwbGljZSh0aGlzLl9udW1fdHJlZXMpO1xuICB9O1xuXG4gIFJhbmRvbUZvcmVzdC5wcm90b3R5cGUuc2NvcmUgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgdmFyIGJlc3RfbGFiZWwsIGJlc3Rfc2NvcmUsIGksIGssIGxhYmVsLCBvdXRwdXQsIHJlZiwgcmVmMSwgcmlnaHQsIHNjb3JlLCB0b3RhbDtcbiAgICByaWdodCA9IDA7XG4gICAgdG90YWwgPSAwO1xuICAgIG91dHB1dCA9IHRoaXMucHJlZGljdCh4KTtcbiAgICBmb3IgKGkgPSBrID0gMCwgcmVmID0gb3V0cHV0Lmxlbmd0aDsgMCA8PSByZWYgPyBrIDwgcmVmIDogayA+IHJlZjsgaSA9IDAgPD0gcmVmID8gKytrIDogLS1rKSB7XG4gICAgICBiZXN0X3Njb3JlID0gMDtcbiAgICAgIGJlc3RfbGFiZWwgPSBmYWxzZTtcbiAgICAgIHJlZjEgPSBvdXRwdXRbaV07XG4gICAgICBmb3IgKGxhYmVsIGluIHJlZjEpIHtcbiAgICAgICAgc2NvcmUgPSByZWYxW2xhYmVsXTtcbiAgICAgICAgaWYgKHNjb3JlID4gYmVzdF9zY29yZSkge1xuICAgICAgICAgIGJlc3Rfc2NvcmUgPSBzY29yZTtcbiAgICAgICAgICBiZXN0X2xhYmVsID0gbGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChiZXN0X2xhYmVsID09PSB5W2ldKSB7XG4gICAgICAgIHJpZ2h0Kys7XG4gICAgICB9XG4gICAgICB0b3RhbCsrO1xuICAgIH1cbiAgICByZXR1cm4gcmlnaHQgLyB0b3RhbDtcbiAgfTtcblxuICBSYW5kb21Gb3Jlc3QucHJvdG90eXBlLnByZWRpY3QgPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIGssIGxlbiwgeF9pLCB5O1xuICAgIHkgPSBbXTtcbiAgICBmb3IgKGsgPSAwLCBsZW4gPSB4Lmxlbmd0aDsgayA8IGxlbjsgaysrKSB7XG4gICAgICB4X2kgPSB4W2tdO1xuICAgICAgeS5wdXNoKHRoaXMucHJlZGljdF9vbmUoeF9pKSk7XG4gICAgfVxuICAgIHJldHVybiB5O1xuICB9O1xuXG4gIFJhbmRvbUZvcmVzdC5wcm90b3R5cGUucHJlZGljdF9vbmUgPSBmdW5jdGlvbih4X2kpIHtcbiAgICB2YXIgaywgbGVuLCByZWYsIHRyZWUsIHlfaTtcbiAgICB5X2kgPSBbXTtcbiAgICByZWYgPSB0aGlzLl90cmVlcztcbiAgICBmb3IgKGsgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgIHRyZWUgPSByZWZba107XG4gICAgICB5X2kucHVzaCh0cmVlLnByZWRpY3Rfb25lKHhfaSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29sbGF0ZSh5X2kpO1xuICB9O1xuXG4gIFJhbmRvbUZvcmVzdC5wcm90b3R5cGUuX2NvbGxhdGUgPSBmdW5jdGlvbihhcnIpIHtcbiAgICB2YXIgYWNjLCBpLCBrLCBrZXksIHJlZiwgcmVmMSwgdmFsdWU7XG4gICAgYWNjID0ge307XG4gICAgZm9yIChpID0gayA9IDAsIHJlZiA9IGFyci5sZW5ndGg7IDAgPD0gcmVmID8gayA8IHJlZiA6IGsgPiByZWY7IGkgPSAwIDw9IHJlZiA/ICsrayA6IC0taykge1xuICAgICAgcmVmMSA9IGFycltpXTtcbiAgICAgIGZvciAoa2V5IGluIHJlZjEpIHtcbiAgICAgICAgdmFsdWUgPSByZWYxW2tleV07XG4gICAgICAgIGlmICghYWNjW2tleV0pIHtcbiAgICAgICAgICBhY2Nba2V5XSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgYWNjW2tleV0gKz0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG4gIH07XG5cbiAgcmV0dXJuIFJhbmRvbUZvcmVzdDtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb21Gb3Jlc3Q7XG4iXX0=
