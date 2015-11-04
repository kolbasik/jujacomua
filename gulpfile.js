var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var path = {
    src: './source/',
    dst: './web/',
    tmp: './.tmp/'
};

gulp.task('clean', function() {
    return gulp.src([ path.dst, path.tmp ], { read: false })
        .pipe(plugins.rimraf({ force: true }));
});

gulp.task('usemin', function() {
    return gulp.src(path.src + '**/index.jade', { base: path.src })
        .pipe(track_error())
        .pipe(plugins.jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.tmp))
        .pipe(plugins.foreach(function (stream) {
            return stream
                .pipe(plugins.usemin({
                    assetsDir: path.src,
                    outputRelativePath: path.dst,
                    html: [ plugins.minifyHtml({ empty: true }) ],
                    css:  [ plugins.minifyCss(), 'concat', plugins.rev() ],
                    js:   [ plugins.uglify(), plugins.rev() ],
                    inlinejs:  [ plugins.uglify() ],
                    inlinecss: [ plugins.minifyCss(), 'concat' ]
                }))
                .pipe(gulp.dest(path.dst));
        }));
});

gulp.task('copyfonts', function() {
    return gulp.src(path.src + 'assets/fonts/*.*')
        .pipe(gulp.dest(path.dst + 'assets/fonts/'));
});

gulp.task('imagemin', function() {
    var pngquant = require('imagemin-pngquant');
    return gulp.src(path.src + '**/*.{png,jpg,ico}', { base: path.src })
        .pipe(plugins.imagemin({
            progressive: false,
            use: [ pngquant() ]
        }))
        .pipe(gulp.dest(path.dst));
});

gulp.task('build', ['usemin'/*, 'copyfonts'*/, 'imagemin']);
gulp.task('default', ['build']);

function track_error() {
    return plugins.plumber({
        errorHandler: trace_error("plumber")
    });
}

function trace_error (title) {
    return function write_error(error) {
        var trace = plugins.notify.onError({
            title:    "Gulp:" + title,
            message:  "Error: <%= error.message %>",
            sound:    "Beep"
        });
        trace(error);
        console.log(error.toString());
        this.emit && this.emit("end");
    };
}
