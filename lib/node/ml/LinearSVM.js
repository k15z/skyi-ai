(function() {
  var LinearSVM;

  LinearSVM = (function() {
    var epoch, lr;

    lr = 0.01;

    epoch = 100;

    function LinearSVM(num_features) {
      this.num_features = num_features;
      this.b = 0.5 - Math.random();
      this.w = (function() {
        var k, ref, results;
        results = [];
        for (k = 0, ref = this.num_features; 0 <= ref ? k < ref : k > ref; 0 <= ref ? k++ : k--) {
          results.push(0.5 - Math.random());
        }
        return results;
      }).call(this);
    }

    LinearSVM.prototype.fit = function(x, y) {
      var e, has_mistake, i, j, k, l, m, num_samples, ref, ref1, ref2, results;
      num_samples = x.length;
      results = [];
      for (e = k = 0, ref = epoch; 0 <= ref ? k < ref : k > ref; e = 0 <= ref ? ++k : --k) {
        has_mistake = false;
        for (i = l = 0, ref1 = num_samples; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
          if (this.predict_one(x[i]) * y[i] < 1) {
            has_mistake = true;
            for (j = m = 0, ref2 = this.num_features; 0 <= ref2 ? m < ref2 : m > ref2; j = 0 <= ref2 ? ++m : --m) {
              this.w[j] += lr * x[i][j] * y[i];
            }
          }
        }
        if (!has_mistake) {
          break;
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
      y_i = this.b;
      for (j = k = 0, ref = this.num_features; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
        y_i += this.w[j] * x_i[j];
      }
      return y_i;
    };

    return LinearSVM;

  })();

  module.exports = LinearSVM;

}).call(this);
