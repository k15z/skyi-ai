
class HoGImage
    num_bins = 16

    constructor: (image_data) ->
        @data = image_data.data
        @width = image_data.width
        @height = image_data.height

        @luma = []
        for y in [0...@height]
            row = []
            for x in [0...@width]
                r = @data[(y*@width+x)*4+0]
                g = @data[(y*@width+x)*4+1]
                b = @data[(y*@width+x)*4+2]
                row.push(r + g + b)
            @luma.push(row)

        @grad = []
        for y in [0...@height]
            row = []
            for x in [0...@width]
                if y == 0 or y == @height - 1 
                    row.push(0)
                else if x == 0 or x == @width - 1 
                    row.push(0)
                else
                    dy = @luma[y-1][x] - @luma[y+1][x]
                    dx = @luma[y][x+1] - @luma[y][x-1]
                    angle = Math.atan2(dy, dx)
                    row.push(angle)
            @grad.push(row)

    histogram: (box, rows=1, cols=1) ->
        vector = []
        cell_w = Math.floor(box.w / cols)
        cell_h = Math.floor(box.h / rows)
        for y in [box.y...box.y+box.h] by cell_h
            for x in [box.x...box.x+box.w] by cell_w
                vector = vector.concat(@_histogram({
                    x: x, y: y, w: cell_w, h: cell_h
                }))
        return vector

    _histogram: (box) ->
        bins = (0 for [0...num_bins])
        for y in [box.y...box.y+box.h]
            for x in [box.x...box.x+box.w]
                angle = (@grad[y][x] + Math.PI - 1e-10) / (2 * Math.PI)
                bins[Math.floor(angle * num_bins)]++;
        total = bins.reduce((t, s) -> t + s)
        bins = (i / total for i in bins)
        return bins

module.exports = HoGImage
