(function() {
  var ai;

  ai = module.exports;

  ai.ml = {};

  ai.vision = {};

  ai.ml.DecisionTree = require('./ml/DecisionTree');

  ai.ml.RandomForest = require('./ml/RandomForest');

  ai.ml.LinearSVM = require('./ml/LinearSVM');

  ai.vision.RandomForest = require('./ml/RandomForest');

}).call(this);
