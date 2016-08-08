(function() {
  var HoGImage;

  HoGImage = (function() {
    var num_bins;

    num_bins = 16;

    function HoGImage(image_data) {
      var angle, b, dx, dy, g, j, k, l, m, r, ref, ref1, ref2, ref3, row, x, y;
      this.data = image_data.data;
      this.width = image_data.width;
      this.height = image_data.height;
      this.luma = [];
      for (y = j = 0, ref = this.height; 0 <= ref ? j < ref : j > ref; y = 0 <= ref ? ++j : --j) {
        row = [];
        for (x = k = 0, ref1 = this.width; 0 <= ref1 ? k < ref1 : k > ref1; x = 0 <= ref1 ? ++k : --k) {
          r = this.data[(y * this.width + x) * 4 + 0];
          g = this.data[(y * this.width + x) * 4 + 1];
          b = this.data[(y * this.width + x) * 4 + 2];
          row.push(r + g + b);
        }
        this.luma.push(row);
      }
      this.grad = [];
      for (y = l = 0, ref2 = this.height; 0 <= ref2 ? l < ref2 : l > ref2; y = 0 <= ref2 ? ++l : --l) {
        row = [];
        for (x = m = 0, ref3 = this.width; 0 <= ref3 ? m < ref3 : m > ref3; x = 0 <= ref3 ? ++m : --m) {
          if (y === 0 || y === this.height - 1) {
            row.push(0);
          } else if (x === 0 || x === this.width - 1) {
            row.push(0);
          } else {
            dy = this.luma[y - 1][x] - this.luma[y + 1][x];
            dx = this.luma[y][x + 1] - this.luma[y][x - 1];
            angle = Math.atan2(dy, dx);
            row.push(angle);
          }
        }
        this.grad.push(row);
      }
    }

    HoGImage.prototype.histogram = function(box, rows, cols) {
      var cell_h, cell_w, j, k, ref, ref1, ref2, ref3, ref4, ref5, vector, x, y;
      if (rows == null) {
        rows = 1;
      }
      if (cols == null) {
        cols = 1;
      }
      vector = [];
      cell_w = Math.floor(box.w / cols);
      cell_h = Math.floor(box.h / rows);
      for (y = j = ref = box.y, ref1 = box.y + box.h - cell_h + 1, ref2 = cell_h; ref2 > 0 ? j < ref1 : j > ref1; y = j += ref2) {
        for (x = k = ref3 = box.x, ref4 = box.x + box.w - cell_w + 1, ref5 = cell_w; ref5 > 0 ? k < ref4 : k > ref4; x = k += ref5) {
          vector = vector.concat(this._histogram({
            x: x,
            y: y,
            w: cell_w,
            h: cell_h
          }));
        }
      }
      return vector;
    };

    HoGImage.prototype._histogram = function(box) {
      var angle, bins, i, j, k, ref, ref1, ref2, ref3, total, x, y;
      bins = (function() {
        var j, ref, results;
        results = [];
        for (j = 0, ref = num_bins; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--) {
          results.push(0);
        }
        return results;
      })();
      for (y = j = ref = box.y, ref1 = box.y + box.h; ref <= ref1 ? j < ref1 : j > ref1; y = ref <= ref1 ? ++j : --j) {
        for (x = k = ref2 = box.x, ref3 = box.x + box.w; ref2 <= ref3 ? k < ref3 : k > ref3; x = ref2 <= ref3 ? ++k : --k) {
          angle = (this.grad[y][x] + Math.PI - 1e-10) / (2 * Math.PI);
          bins[Math.floor(angle * num_bins)]++;
        }
      }
      total = bins.reduce(function(t, s) {
        return t + s;
      });
      bins = (function() {
        var l, len, results;
        results = [];
        for (l = 0, len = bins.length; l < len; l++) {
          i = bins[l];
          results.push(i / total);
        }
        return results;
      })();
      return bins;
    };

    return HoGImage;

  })();

  module.exports = HoGImage;

}).call(this);
