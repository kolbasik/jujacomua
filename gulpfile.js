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
    return gulp.src(path.src + '**/*.html', { base: path.src })
        .pipe(plugins.usemin({
            assetsDir: path.src,
            outputRelativePath: path.dst,
            html: [ plugins.minifyHtml({ empty: true }) ],
            css:  [ plugins.minifyCss(), 'concat', plugins.rev() ],
            js:   [ plugins.uglify(), plugins.rev() ],
            inlinejs: [ plugins.uglify() ],
            inlinecss: [ plugins.minifyCss(), 'concat' ]
        }))
        .pipe(gulp.dest(path.dst));
});

gulp.task('copyfonts', function() {
    return gulp.src(path.src + 'assets/fonts/*.*')
        .pipe(gulp.dest(path.dst + 'assets/fonts/'));
});

gulp.task('imagemin', function() {
    return gulp.src(path.src + '**/*.{png,jpg,jpeg}', { base: path.src })
        .pipe(plugins.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(path.dst));
});

gulp.task('build', ['usemin', 'copyfonts', 'imagemin']);
gulp.task('default', ['build']);