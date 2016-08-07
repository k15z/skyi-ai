(function() {
  var ai;

  ai = module.exports;

  ai.ml = {};

  ai.vision = {};

  ai.ml.DecisionTree = require('./ml/DecisionTree');

  ai.ml.RandomForest = require('./ml/RandomForest');

  ai.vision.RandomForest = require('./ml/RandomForest');

}).call(this);
