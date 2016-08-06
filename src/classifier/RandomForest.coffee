DecisionTree = require('./DecisionTree')

# This class implements a random forest by building a DecisionTree array. Since
# the current DecisionTree implementation is already heavily randomized and is
# unlikely to overfit, this class does not split up the data set. Instead, it 
# passes the entire data set to each DecisionTree for processing.
class RandomForest
    constructor: (num_trees=100, depth=2) ->
        @trees = []
        @depth = depth
        @num_trees = num_trees

    # Return a JSON string containing an array of strings.
    save: ->
        trees = []
        for tree in @trees
            trees.push(tree.save())
        return JSON.stringify(trees)

    # Load trees from JSON string.
    load: (str) ->
        trees = []
        models = JSON.parse(str)
        for model in models
            tree = new DecisionTree()
            tree.load(model)
            trees.push(tree)
        @trees = trees

    # Create and fit `num_trees` decision trees.
    # - `x` should be a 2d array of size num_samples * num_features
    # - `y` should an array of size num_samples.
    fit: (x, y, depth=3) ->
        for i in [0...@num_trees]
            tree = new DecisionTree(@depth)
            @trees.push(tree)
            tree.fit(x, y)

    # Return an array of probability distributions.
    # - `x` should be a 2d array of size num_samples * num_features
    predict: (x) ->
        y = []
        for x_i in x
            y.push(@predictOne(x_i))
        return y

    # Return the probability distributions over `y`.
    # - `x_i` should be an array of size num_features
    predictOne: (x_i) ->
        y_i = []
        for tree in @trees
            y_i.push(tree.predictOne(x_i))
        return @_collate(y_i)

    # Combine the counts for each tree into one distribution.
    # - `arr` should be an array of objects with shared labels
    _collate: (arr) ->
        acc = {}
        for obj in arr
            for key, value of obj
                if not acc[key]
                    acc[key] = 0
                acc[key] += value
        return acc

module.exports = RandomForest
