var fs = require('fs');
var rimraf = require('rimraf');

var gulp = require('gulp');
var rename = require('gulp-rename');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

gulp.task('clean', function(cb) {
  rimraf('./dist', cb);
});

gulp.task('template', function(done) {
  gulp
  .src('./src/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./dist/'))
  .on('end', function() {
    done();
  });
});

gulp.task('style', function() {
  gulp
  .src('./src/*.styl')
  .pipe(stylus())
  .pipe(gulp.dest('./dist/'))
  .pipe(minifyCSS())
  .pipe(rename({
    suffix: '.min' 
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('script', ['template'], function() {
  gulp
  .src('./src/*.js')
  .pipe(replace('{html}', function() {
    var str = fs.readFileSync('./dist/template.html', 'utf8');
    return str.replace(/\'/g, '\\\'');
  }))
  .pipe(gulp.dest('./dist'))
  .pipe(uglify({
    preserveComments: 'some'
  }))
  .pipe(rename({
    suffix: '.min' 
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/*.*'], ['default']);
});

gulp.task('default', ['template', 'script', 'style', 'watch']);