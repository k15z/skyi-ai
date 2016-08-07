(function() {
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

}).call(this);
