(function() {
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

}).call(this);
