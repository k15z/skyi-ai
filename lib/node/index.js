(function() {
  var ai;

  ai = module.exports;

  ai.classifier = {};

  ai.classifier.DecisionTree = require('./classifier/DecisionTree');

  ai.classifier.RandomForest = require('./classifier/RandomForest');

}).call(this);
