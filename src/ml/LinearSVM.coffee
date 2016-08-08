class LinearSVM

    constructor: (opts={}) ->
        @l_rate = if opts.l_rate? then opts.l_rate else 0.01
        @epochs = if opts.epochs? then opts.epochs else 1000
        @verbose = if opts.verbose? then opts.verbose else true


    load: (obj) ->
        @bias = obj.bias
        @weight = obj.weight

    save: ->
        return {
            bias: @bias
            weight: @weight
        }

    fit: (x, y) ->
        num_samples = x.length
        num_features = x[0].length
        if not @bias or not @weight
            @bias = 0.5 - Math.random()
            @weight = (0.5 - Math.random() for [0...num_features])
        for e in [0...@epochs]
            incorrect = 0
            for i in [0...num_samples]
                if @predict_one(x[i]) * y[i] < 1
                    incorrect++
                    for j in [0...@weight.length]
                        @weight[j] += @l_rate * x[i][j] * y[i]
                        @bias += @l_rate * y[i]
            accuracy = 1.0 - incorrect / num_samples
            if @verbose
                console.log("epoch #{e}: #{accuracy} acc")

    predict: (x) ->
        y = []
        for x_i in x
            y.push(@predict_one(x_i))
        return y

    predict_one: (x_i) ->
        y_i = @bias
        for j in [0...@weight.length]
            y_i += @weight[j] * x_i[j]
        return y_i

module.exports = LinearSVM
