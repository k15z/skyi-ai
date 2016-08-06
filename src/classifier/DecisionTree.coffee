# This class implements a randomized decision tree. It randomly selects features 
# and values to split on - it repeats this process a few times, finding the pair
# with the lowest Gini impurity before moving to the left/right nodes. It is not
# meant to be used independently; for most applications, the RandomForest class 
# will provide significantly better results.
class DecisionTree

    constructor: (depth = 5, num_tries=10)->
        @tree = {}
        @depth = depth
        @num_tries = num_tries

    # Save to JSON string.
    save: ->
        return JSON.stringify(@tree)

    # Load from JSON string.
    load: (str) ->
        @tree = JSON.parse(str)

    # Fit this decision tree to the given training data.
    # - `x` should be a 2d array of size num_samples * num_features
    # - `y` should an array of size num_samples.
    fit: (x, y) ->
        @_buildTree(x, y, @tree, @depth)

    # Return an array of objects representing the probability distribution.
    # - `x` should be a 2d array of size num_samples * num_features
    predict: (x) ->
        y = []
        for x_i in x
            y.push(@predictOne(x_i))
        return y

    # Return an object representing the probability distribution over labels.
    # - `x_i` should be an array of size num_features
    predictOne: (x_i) ->
        base = @tree
        while not base.terminal
            if x_i[base.index] < base.split
                base = base.left
            else
                base = base.right
        return base.y

    # Recursive function - fit the `base` node to `x` and `y` and recursively 
    # fit the left and right nodes until `depth` reaches `0`.
    _buildTree: (x, y, base, depth) ->
        lowest_impurity = 10000
        best_feature_index = 0
        best_feature_split = 0

        num_samples = x.length
        num_features = x[0].length
        for epoch in [0...@num_tries]
            feature_index = @_randInt(num_features)
            feature_split = @_randSplit(x[@_randInt(num_samples)][feature_index], x[@_randInt(num_samples)][feature_index])
            less_than_x = []
            less_than_y = []
            greater_than_x = []
            greater_than_y = []
            for i in [0...num_samples]
                if x[i][feature_index] < feature_split
                    less_than_x.push(x[i])
                    less_than_y.push(y[i])
                else
                    greater_than_x.push(x[i])
                    greater_than_y.push(y[i])
            impurity = @_impurity(less_than_y) + @_impurity(greater_than_y)
            if impurity < lowest_impurity
                lowest_impurity = impurity
                best_feature_index = feature_index
                best_feature_split = feature_split

        base.impurity = lowest_impurity
        base.index = best_feature_index
        base.split = best_feature_split
        if depth > 0
            if less_than_y.length > 0
                base.left = {}
                @_buildTree(less_than_x, less_than_y, base.left, depth-1)
            else
                base.left = {}
                base.left.terminal = true
                base.left.y = @_counter(less_than_y)[0]
            if greater_than_y.length > 0
                base.right = {}
                @_buildTree(greater_than_x, greater_than_y, base.right, depth-1)
            else
                base.right = {}
                base.right.terminal = true
                base.right.y = @_counter(greater_than_y)[0]
        else
            [obj, total] = @_counter(y)
            base.terminal = true
            base.y = obj

    # Return random integer in range [0, max)
    _randInt: (max) ->
        return parseInt(Math.random() * max)

    # Return random value in range (a, b]
    _randSplit: (a, b) ->
        p = Math.random()
        return a * p + b * (1 - p)

    # Compute Gini impurity (1 - sum(p_i^2)
    _impurity: (y) ->
        [obj, total] = @_counter(y)
        impurity = 1.0
        for key, value of obj
            impurity -= (value / total) * (value / total)
        return impurity

    # Count the number of occurences of each discrete alue in `y`
    _counter: (y) ->
        obj = {}
        total = 0
        for label in y
            if not obj[label]
                obj[label] = 0
            obj[label] += 1
            total += 1
        return [obj, total]

module.exports = DecisionTree
