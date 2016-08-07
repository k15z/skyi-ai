# # skyi.ai.*
# This module implements a variety of common machine learning algorithms from decision 
# trees to support vector machines. It is primarily designed for classification tasks
# but it does include some basic support for regression problems.

ai = module.exports

# [ai.DecisionTree](forestry/DecisionTree.html)
ai.DecisionTree = require('./forestry/DecisionTree')

# [ai.RandomForest](forestry/RandomForest.html)
ai.RandomForest = require('./forestry/RandomForest')
