var fs = require('fs');
var rimraf = require('rimraf');

var gulp = require('gulp');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var protractor = require('gulp-protractor').protractor;
var webserver = require('gulp-webserver');
var webserverStream;

var config = {
  http: {
    host: 'localhost',
    port: 8888
  }
};

gulp.task('clean', function(cb) {
  rimraf('./dist', cb);
});

gulp.task('template', function() {
  return gulp
  .src('./src/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./dist/'));
});

gulp.task('style', function() {
  return gulp
  .src('./src/*.styl')
  .pipe(stylus())
  .pipe(gulp.dest('./dist/'))
  .pipe(minifyCSS())
  .pipe(rename({
    suffix: '.min' 
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('script', function() {
  return gulp
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

gulp.task('webserver', function() {
  webserverStream = gulp
  .src(['example', 'bower_components', 'dist'])
  .pipe(webserver({
    hot: config.http.host,
    port: config.http.port
  }));

  return webserverStream;
});

gulp.task('protractor', function() {
  return gulp
  .src(['./test/e2e/spec/*.js'])
  .pipe(protractor({
    configFile: 'test/e2e/config.js',
    args: [
      '--baseUrl', 'http://' + config.http.host + ':' + config.http.port]
  }))
  .on('error', function(e) { throw e; });
});

gulp.task('test:e2e', function(callback) {
  runSequence(
    'webserver',
    'protractor',
    function() {
      webserverStream.emit('kill');
      callback();
    }
  );
});

gulp.task('travis:e2e', ['protractor']);

gulp.task('watch', function() {
  gulp.watch(['./src/*.*'], ['default']);
});

gulp.task('default', function(callback) {
  runSequence(
    'webserver',
    'template',
    'script',
    'style',
    'watch',
    callback
  );
});
