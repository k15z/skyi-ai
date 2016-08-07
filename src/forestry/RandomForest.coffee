DecisionTree = require('./DecisionTree')

class RandomForest

    constructor: (opts={}) ->
        @_trees = []
        @_opts = opts
        @_verbose = if opts.verbose then opts.verbose else false
        @_num_trees = if opts.num_trees then opts.num_trees else 8
        @_num_folds = if opts.num_folds then opts.num_folds else 1
        @_redundancy = if opts.redundancy then opts.redundancy else 1

    save: ->
        trees = []
        for tree in @_trees
            trees.push(tree.save())
        return trees

    load: (trees) ->
        _trees = []
        for tree in trees
            _tree = new DecisionTree()
            _tree.load(tree)
            _trees.push(_tree)
        @_trees = _trees

    fit: (x, y) ->
        for i in [0...@_num_trees * @_redundancy]
            if @_verbose
                console.log("building tree #{i}...")
            sub_x = []
            sub_y = []
            tree = new DecisionTree(@_opts)
            num_subset = Math.floor(x.length / @_num_folds)
            for i in [0...num_subset]
                j = parseInt(Math.random()*x.length)
                sub_x.push(x[j])
                sub_y.push(y[j])
            tree.fit(sub_x, sub_y)
            @_trees.push(tree)
        @_trees.sort((a, b) -> b._score - a._score)
        @_trees.splice(@_num_trees)

    score: (x, y) ->
        right = 0
        total = 0
        output = @predict(x)
        for i in [0...output.length]
            best_score = 0
            best_label = false
            for label, score of output[i]
                if score > best_score
                    best_score = score
                    best_label = label
            if best_label == y[i]
                right++
            total++
        return right / total

    predict: (x) ->
        y = []
        for x_i in x
            y.push(@predict_one(x_i))
        return y

    predict_one: (x_i) ->
        y_i = []
        for tree in @_trees
            y_i.push(tree.predict_one(x_i))
        return @_collate(y_i)

    _collate: (arr) ->
        acc = {}
        for i in [0...arr.length]
            for key, value of arr[i]
                if not acc[key]
                    acc[key] = 0
                acc[key] += value
        return acc

module.exports = RandomForest
