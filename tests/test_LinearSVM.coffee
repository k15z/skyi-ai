assert = require("assert")

describe("LinearSVM", ->
    skyi = {}
    skyi.ai = require("../src")
    model = new skyi.ai.ml.LinearSVM({
        verbose: false
    })

    fit = ->
        model.fit([
            [-1, -1],
            [1, 1]
        ], [-1, 1])

    predict = ->
        assert.ok(model.predict_one([-1,-1]) < -1)
        assert.ok(model.predict_one([1,1]) > 1)

    predict_one = ->
        result = model.predict([
            [-1, -1],
            [1, 1]
        ])
        assert.ok(result[0] < -1)
        assert.ok(result[1] > 1)

    save_load = ->
        str = model.save()
        model = new skyi.ai.ml.LinearSVM()
        model.load(str)

    it("fit", fit)
    it("predict", predict)
    it("predict_one", predict_one)
    it("save/load", save_load)
    it("save/load predict", predict)
    it("save/load predict_one", predict_one)
)
