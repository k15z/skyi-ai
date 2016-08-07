class DecisionTree

    constructor: (opts={}) ->
        @_tree = {}
        @_score = false
        @_max_depth = if opts.max_depth then opts.max_depth else 32
        @_num_tries = if opts.num_tries then opts.num_tries else 16

    save: ->
        return @_tree

    load: (tree) ->
        @_tree = tree

    fit: (x, y) ->
        @_build_node(x, y, @_tree, @_max_depth)
        @_score = @score(x, y)

    score: (x, y) ->
        right = 0
        total = 0
        output = @predict(x)
        for i in [0...output.length]
            best_count = 0
            best_label = false
            for label, count of output[i]
                if count > best_count
                    best_count = count
                    best_label = label
            if best_label+"" == y[i]+""
                right++
            total++
        return right / total

    predict: (x) ->
        y = []
        for x_i in x
            y.push(@predict_one(x_i))
        return y

    predict_one: (x_i) ->
        base = @_tree
        while base and not base.leaf
            if x_i[base.index] < base.split
                base = base.left
            else
                base = base.right
        if not base
            return {}
        return base.distribution

    _build_node: (x, y, node, depth) ->
        [obj, total] = @_count(y)
        if depth == 0 or Object.keys(obj).length <= 1
            node.leaf = true
            node.total = total
            node.distribution = obj
        else
            best = @_select_split(x, y)
            node.index = best.index
            node.split = best.split
            node.left = {}
            @_build_node(best.left_x, best.left_y, node.left, depth-1)
            node.right = {}
            @_build_node(best.right_x, best.right_y, node.right, depth-1)

    _select_split: (x, y) ->
        num_samples = x.length
        num_features = x[0].length
        best = {
            impurity: Number.MAX_SAFE_INTEGER
            index: -1
            split: -1
            left_x: []
            left_y: []
            right_x: []
            right_y: []
        }
        for trie in [0...@_num_tries]
            current = {}
            current.impurity = 0
            current.index = @_rand_int(num_features)
            current.split = @_rand_float(x[@_rand_int(num_samples)][current.index], x[@_rand_int(num_samples)][current.index])
            current.left_x = []
            current.left_y = []
            current.right_x = []
            current.right_y = []
            for i in [0...num_samples]
                if x[i][current.index] < current.split
                    current.left_x.push(x[i])
                    current.left_y.push(y[i])
                else
                    current.right_x.push(x[i])
                    current.right_y.push(y[i])
            current.impurity = @_impurity(current.left_y) + @_impurity(current.right_y)
            if current.impurity < best.impurity
                best = current
        return best

    _rand_int: (max) ->
        value = Math.random() * max
        return Math.floor(value)

    _rand_float: (a, b) ->
        p = Math.random()
        return a * p + b * (1 - p)

    _count: (y) ->
        obj = {}
        total = 0
        for label in y
            if not obj[label]
                obj[label] = 0
            obj[label] += 1
            total += 1
        return [obj, total]

    _impurity: (y) ->
        impurity = 1.0
        [obj, total] = @_count(y)
        for key, value of obj
            impurity -= (value / total) * (value / total)
        return impurity

module.exports = DecisionTree
