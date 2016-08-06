del = require('del')
gulp = require('gulp')
mocha = require('gulp-mocha')
docco = require("gulp-docco")
coffee = require("gulp-coffee")
rename = require("gulp-rename")
uglify = require('gulp-uglify')
coffeeify = require('gulp-coffeeify')
coffeelint = require('gulp-coffeelint')
 
gulp.task('clean', -> 
    return del("./docs/**")
)

gulp.task('lint', -> 
    targets = ['./gulpfile.coffee', './src/**/*.coffee', './tests/**/*.coffee']
    targets.map((target) ->
        gulp.src(target)
            .pipe(coffeelint({
                "indentation": {"value": 4},
                "max_line_length": {"level": "ignore"},
                "no_trailing_whitespace": {"level": "ignore"}
            }))
            .pipe(coffeelint.reporter())
    )
)

gulp.task('test', -> 
    gulp.src('./tests/**/*.coffee')
        .pipe(mocha({reporter: 'spec'}))
)

gulp.task('docs', -> 
    gulp.src("./src/**/*.coffee")
        .pipe(docco())
        .pipe(gulp.dest('./docs'))
)

gulp.task('build', -> 
    gulp.src('./src/**/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('./lib/node'))
    gulp.src('./src/**/*.coffee')
        .pipe(coffeeify({options: {debug: true}}))
        .pipe(rename('skyi-ai.js'))
        .pipe(gulp.dest('./lib/web'))
        .pipe(uglify())
        .pipe(rename('skyi-ai.min.js'))
        .pipe(gulp.dest('./lib/web'))
)

gulp.task('watch', -> 
    gulp.watch('./src/**', ['default'])
)

gulp.task('default', ['clean', 'lint', 'test', 'docs', 'build'])
