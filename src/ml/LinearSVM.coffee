class LinearSVM
    lr = 0.01
    epoch = 100

    constructor: (num_features) ->
        @num_features = num_features
        @b = 0.5 - Math.random()
        @w = (0.5 - Math.random() for [0...@num_features])

    fit: (x, y) ->
        num_samples = x.length
        for e in [0...epoch]
            has_mistake = false
            for i in [0...num_samples]
                if @predict_one(x[i]) * y[i] < 1
                    has_mistake = true
                    for j in [0...@num_features]
                        @w[j] += lr * x[i][j] * y[i]
            if not has_mistake
                break

    predict: (x) ->
        y = []
        for x_i in x
            y.push(@predict_one(x_i))
        return y

    predict_one: (x_i) ->
        y_i = @b
        for j in [0...@num_features]
            y_i += @w[j] * x_i[j]
        return y_i

module.exports = LinearSVM
