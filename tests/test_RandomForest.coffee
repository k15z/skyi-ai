assert = require("assert")

describe("RandomForest", ->
    skyi = {}
    skyi.ai = require("../src")
    model = new skyi.ai.classifier.RandomForest()

    fit = ->
        model.fit([
            [1,1,1],
            [1,0.75,1],
            [1,0.25,1],
            [1,0,1],
            [1,0,0]
        ], ['a','a','b','b','c'])

    predict = ->
        result = model.predict([
            [1,1,1],
            [1,0,1],
            [1,0,0]
        ])

        a = result[0]['a'] || 0
        b = result[0]['b'] || 0
        c = result[0]['c'] || 0
        assert.ok(a > b, "Should predict a, got b.")
        assert.ok(a > c, "Should predict a, got c.")

        a = result[1]['a'] || 0
        b = result[1]['b'] || 0
        c = result[1]['c'] || 0
        assert.ok(b > a, "Should predict b, got a.")
        assert.ok(b > c, "Should predict b, got c.")

        a = result[2]['a'] || 0
        b = result[2]['b'] || 0
        c = result[2]['c'] || 0
        assert.ok(c > a, "Should predict c, got a.")
        assert.ok(c > b, "Should predict c, got b.")

    predictOne = ->
        result = model.predictOne([1,1,1])
        a = result['a'] || 0
        b = result['b'] || 0
        c = result['c'] || 0
        assert.ok(a > b, "Should predict a, got b.")
        assert.ok(a > c, "Should predict a, got c.")

        result = model.predictOne([1,0,1])
        a = result['a'] || 0
        b = result['b'] || 0
        c = result['c'] || 0
        assert.ok(b > a, "Should predict b, got a.")
        assert.ok(b > c, "Should predict b, got c.")

        result = model.predictOne([1,0,0])
        a = result['a'] || 0
        b = result['b'] || 0
        c = result['c'] || 0
        assert.ok(c > a, "Should predict c, got a.")
        assert.ok(c > b, "Should predict c, got b.")

    saveLoad = ->
        str = model.save()
        model = new skyi.ai.classifier.RandomForest()
        model.load(str)

    it("fit", fit)
    it("predict", predict)
    it("predictOne", predictOne)
    it("save/load", saveLoad)
    it("save/load predict", predict)
    it("save/load predictOne", predictOne)
)
