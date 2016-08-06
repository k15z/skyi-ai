# # skyi.ai.*
# This module implements a variety of common machine learning algorithms from decision 
# trees to support vector machines. It is primarily designed for classification tasks
# but it does include some basic support for regression problems.

ai = module.exports

# ## Classifiers
ai.classifier = {}

# [ai.classifier.DecisionTree](classifier/DecisionTree.html)
ai.classifier.DecisionTree = require('./classifier/DecisionTree')

# [ai.classifier.RandomForest](classifier/RandomForest.html)
ai.classifier.RandomForest = require('./classifier/RandomForest')
