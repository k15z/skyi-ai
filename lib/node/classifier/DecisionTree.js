(function() {
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

}).call(this);
