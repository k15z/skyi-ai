assert = require("assert")

describe("LinearSVM", ->
    skyi = {}
    skyi.ai = require("../src")
    model = new skyi.ai.ml.LinearSVM(2)

    it("fit", ->
        model.fit([
            [-1, -1],
            [1, 1]
        ], [-1, 1])
    )

    it("predict_one", ->
        assert.ok(model.predict_one([-1,-1]) < -1)
        assert.ok(model.predict_one([1,1]) > 1)
    )

    it("predict", ->
        result = model.predict([
            [-1, -1],
            [1, 1]
        ])
        assert.ok(result[0] < -1)
        assert.ok(result[1] > 1)
    )
)
