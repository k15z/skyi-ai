(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJIb0dJbWFnZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgSG9HSW1hZ2U7XG5cbkhvR0ltYWdlID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgbnVtX2JpbnM7XG5cbiAgbnVtX2JpbnMgPSAxNjtcblxuICBmdW5jdGlvbiBIb0dJbWFnZShpbWFnZV9kYXRhKSB7XG4gICAgdmFyIGFuZ2xlLCBiLCBkeCwgZHksIGcsIGosIGssIGwsIG0sIHIsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcm93LCB4LCB5O1xuICAgIHRoaXMuZGF0YSA9IGltYWdlX2RhdGEuZGF0YTtcbiAgICB0aGlzLndpZHRoID0gaW1hZ2VfZGF0YS53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGltYWdlX2RhdGEuaGVpZ2h0O1xuICAgIHRoaXMubHVtYSA9IFtdO1xuICAgIGZvciAoeSA9IGogPSAwLCByZWYgPSB0aGlzLmhlaWdodDsgMCA8PSByZWYgPyBqIDwgcmVmIDogaiA+IHJlZjsgeSA9IDAgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICByb3cgPSBbXTtcbiAgICAgIGZvciAoeCA9IGsgPSAwLCByZWYxID0gdGhpcy53aWR0aDsgMCA8PSByZWYxID8gayA8IHJlZjEgOiBrID4gcmVmMTsgeCA9IDAgPD0gcmVmMSA/ICsrayA6IC0taykge1xuICAgICAgICByID0gdGhpcy5kYXRhWyh5ICogdGhpcy53aWR0aCArIHgpICogNCArIDBdO1xuICAgICAgICBnID0gdGhpcy5kYXRhWyh5ICogdGhpcy53aWR0aCArIHgpICogNCArIDFdO1xuICAgICAgICBiID0gdGhpcy5kYXRhWyh5ICogdGhpcy53aWR0aCArIHgpICogNCArIDJdO1xuICAgICAgICByb3cucHVzaChyICsgZyArIGIpO1xuICAgICAgfVxuICAgICAgdGhpcy5sdW1hLnB1c2gocm93KTtcbiAgICB9XG4gICAgdGhpcy5ncmFkID0gW107XG4gICAgZm9yICh5ID0gbCA9IDAsIHJlZjIgPSB0aGlzLmhlaWdodDsgMCA8PSByZWYyID8gbCA8IHJlZjIgOiBsID4gcmVmMjsgeSA9IDAgPD0gcmVmMiA/ICsrbCA6IC0tbCkge1xuICAgICAgcm93ID0gW107XG4gICAgICBmb3IgKHggPSBtID0gMCwgcmVmMyA9IHRoaXMud2lkdGg7IDAgPD0gcmVmMyA/IG0gPCByZWYzIDogbSA+IHJlZjM7IHggPSAwIDw9IHJlZjMgPyArK20gOiAtLW0pIHtcbiAgICAgICAgaWYgKHkgPT09IDAgfHwgeSA9PT0gdGhpcy5oZWlnaHQgLSAxKSB7XG4gICAgICAgICAgcm93LnB1c2goMCk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA9PT0gMCB8fCB4ID09PSB0aGlzLndpZHRoIC0gMSkge1xuICAgICAgICAgIHJvdy5wdXNoKDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGR5ID0gdGhpcy5sdW1hW3kgLSAxXVt4XSAtIHRoaXMubHVtYVt5ICsgMV1beF07XG4gICAgICAgICAgZHggPSB0aGlzLmx1bWFbeV1beCArIDFdIC0gdGhpcy5sdW1hW3ldW3ggLSAxXTtcbiAgICAgICAgICBhbmdsZSA9IE1hdGguYXRhbjIoZHksIGR4KTtcbiAgICAgICAgICByb3cucHVzaChhbmdsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JhZC5wdXNoKHJvdyk7XG4gICAgfVxuICB9XG5cbiAgSG9HSW1hZ2UucHJvdG90eXBlLmhpc3RvZ3JhbSA9IGZ1bmN0aW9uKGJveCwgcm93cywgY29scykge1xuICAgIHZhciBjZWxsX2gsIGNlbGxfdywgaiwgaywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCB2ZWN0b3IsIHgsIHk7XG4gICAgaWYgKHJvd3MgPT0gbnVsbCkge1xuICAgICAgcm93cyA9IDE7XG4gICAgfVxuICAgIGlmIChjb2xzID09IG51bGwpIHtcbiAgICAgIGNvbHMgPSAxO1xuICAgIH1cbiAgICB2ZWN0b3IgPSBbXTtcbiAgICBjZWxsX3cgPSBNYXRoLmZsb29yKGJveC53IC8gY29scyk7XG4gICAgY2VsbF9oID0gTWF0aC5mbG9vcihib3guaCAvIHJvd3MpO1xuICAgIGZvciAoeSA9IGogPSByZWYgPSBib3gueSwgcmVmMSA9IGJveC55ICsgYm94LmggLSBjZWxsX2ggKyAxLCByZWYyID0gY2VsbF9oOyByZWYyID4gMCA/IGogPCByZWYxIDogaiA+IHJlZjE7IHkgPSBqICs9IHJlZjIpIHtcbiAgICAgIGZvciAoeCA9IGsgPSByZWYzID0gYm94LngsIHJlZjQgPSBib3gueCArIGJveC53IC0gY2VsbF93ICsgMSwgcmVmNSA9IGNlbGxfdzsgcmVmNSA+IDAgPyBrIDwgcmVmNCA6IGsgPiByZWY0OyB4ID0gayArPSByZWY1KSB7XG4gICAgICAgIHZlY3RvciA9IHZlY3Rvci5jb25jYXQodGhpcy5faGlzdG9ncmFtKHtcbiAgICAgICAgICB4OiB4LFxuICAgICAgICAgIHk6IHksXG4gICAgICAgICAgdzogY2VsbF93LFxuICAgICAgICAgIGg6IGNlbGxfaFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2ZWN0b3I7XG4gIH07XG5cbiAgSG9HSW1hZ2UucHJvdG90eXBlLl9oaXN0b2dyYW0gPSBmdW5jdGlvbihib3gpIHtcbiAgICB2YXIgYW5nbGUsIGJpbnMsIGksIGosIGssIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdG90YWwsIHgsIHk7XG4gICAgYmlucyA9IChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqLCByZWYsIHJlc3VsdHM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCByZWYgPSBudW1fYmluczsgMCA8PSByZWYgPyBqIDwgcmVmIDogaiA+IHJlZjsgMCA8PSByZWYgPyBqKysgOiBqLS0pIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSkoKTtcbiAgICBmb3IgKHkgPSBqID0gcmVmID0gYm94LnksIHJlZjEgPSBib3gueSArIGJveC5oOyByZWYgPD0gcmVmMSA/IGogPCByZWYxIDogaiA+IHJlZjE7IHkgPSByZWYgPD0gcmVmMSA/ICsraiA6IC0taikge1xuICAgICAgZm9yICh4ID0gayA9IHJlZjIgPSBib3gueCwgcmVmMyA9IGJveC54ICsgYm94Lnc7IHJlZjIgPD0gcmVmMyA/IGsgPCByZWYzIDogayA+IHJlZjM7IHggPSByZWYyIDw9IHJlZjMgPyArK2sgOiAtLWspIHtcbiAgICAgICAgYW5nbGUgPSAodGhpcy5ncmFkW3ldW3hdICsgTWF0aC5QSSAtIDFlLTEwKSAvICgyICogTWF0aC5QSSk7XG4gICAgICAgIGJpbnNbTWF0aC5mbG9vcihhbmdsZSAqIG51bV9iaW5zKV0rKztcbiAgICAgIH1cbiAgICB9XG4gICAgdG90YWwgPSBiaW5zLnJlZHVjZShmdW5jdGlvbih0LCBzKSB7XG4gICAgICByZXR1cm4gdCArIHM7XG4gICAgfSk7XG4gICAgYmlucyA9IChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsLCBsZW4sIHJlc3VsdHM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGwgPSAwLCBsZW4gPSBiaW5zLmxlbmd0aDsgbCA8IGxlbjsgbCsrKSB7XG4gICAgICAgIGkgPSBiaW5zW2xdO1xuICAgICAgICByZXN1bHRzLnB1c2goaSAvIHRvdGFsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGJpbnM7XG4gIH07XG5cbiAgcmV0dXJuIEhvR0ltYWdlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvR0ltYWdlO1xuIl19
