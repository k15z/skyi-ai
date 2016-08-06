(function() {
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

}).call(this);
