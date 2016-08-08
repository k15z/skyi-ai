(function() {
  var LinearSVM;

  LinearSVM = (function() {
    function LinearSVM(opts) {
      if (opts == null) {
        opts = {};
      }
      this.l_rate = opts.l_rate != null ? opts.l_rate : 0.01;
      this.epochs = opts.epochs != null ? opts.epochs : 1000;
      this.verbose = opts.verbose != null ? opts.verbose : true;
    }

    LinearSVM.prototype.load = function(obj) {
      this.bias = obj.bias;
      return this.weight = obj.weight;
    };

    LinearSVM.prototype.save = function() {
      return {
        bias: this.bias,
        weight: this.weight
      };
    };

    LinearSVM.prototype.fit = function(x, y) {
      var accuracy, e, i, incorrect, j, k, l, m, num_features, num_samples, ref, ref1, ref2, results;
      num_samples = x.length;
      num_features = x[0].length;
      if (!this.bias || !this.weight) {
        this.bias = 0.5 - Math.random();
        this.weight = (function() {
          var k, ref, results;
          results = [];
          for (k = 0, ref = num_features; 0 <= ref ? k < ref : k > ref; 0 <= ref ? k++ : k--) {
            results.push(0.5 - Math.random());
          }
          return results;
        })();
      }
      results = [];
      for (e = k = 0, ref = this.epochs; 0 <= ref ? k < ref : k > ref; e = 0 <= ref ? ++k : --k) {
        incorrect = 0;
        for (i = l = 0, ref1 = num_samples; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
          if (this.predict_one(x[i]) * y[i] < 1) {
            incorrect++;
            for (j = m = 0, ref2 = this.weight.length; 0 <= ref2 ? m < ref2 : m > ref2; j = 0 <= ref2 ? ++m : --m) {
              this.weight[j] += this.l_rate * x[i][j] * y[i];
              this.bias += this.l_rate * y[i];
            }
          }
        }
        accuracy = 1.0 - incorrect / num_samples;
        if (this.verbose) {
          results.push(console.log("epoch " + e + ": " + accuracy + " acc"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    LinearSVM.prototype.predict = function(x) {
      var k, len, x_i, y;
      y = [];
      for (k = 0, len = x.length; k < len; k++) {
        x_i = x[k];
        y.push(this.predict_one(x_i));
      }
      return y;
    };

    LinearSVM.prototype.predict_one = function(x_i) {
      var j, k, ref, y_i;
      y_i = this.bias;
      for (j = k = 0, ref = this.weight.length; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
        y_i += this.weight[j] * x_i[j];
      }
      return y_i;
    };

    return LinearSVM;

  })();

  module.exports = LinearSVM;

}).call(this);
