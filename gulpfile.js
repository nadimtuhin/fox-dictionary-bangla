var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var mainBowerFiles = require('main-bower-files');
var jsonminify = require('gulp-jsonminify');
 
gulp.task('json-minify', function () {
    return gulp.src(['data/db.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('www/data'));
});

var fileFilter = {
  css : function(file){
    return fileFilter.getFileExtension(file) === 'css';
  },
  js : function(file){
    return fileFilter.getFileExtension(file) === 'js';
  },
  font : function(file){
    return ['eot', 'svg', 'ttf', 'woff'].indexOf(fileFilter.getFileExtension(file)) === -1 ? 0 : 1 ;
  },
  getFileExtension: function(file){
    var dot = file.lastIndexOf('.');
    return file.slice(dot+1, file.length);
  }
};

var bowerFiles = {
  'css' : mainBowerFiles({paths:{bowerDirectory: './lib'}, filter: fileFilter.css }),
  'js' : mainBowerFiles({paths:{bowerDirectory: './lib'}, filter: fileFilter.js }),
  'font' : mainBowerFiles({paths:{bowerDirectory: './lib'}, filter: fileFilter.font })
};

gulp.task('bower', function() {
    gulp.src(bowerFiles.css).pipe(concat('vendors.css')).pipe(minifyCss()).pipe(gulp.dest('./www/css'));
    gulp.src(bowerFiles.js).pipe(concat('vendors.js')).pipe(uglify()).pipe(gulp.dest('./www/js'));
    gulp.src(bowerFiles.font).pipe(gulp.dest('./www/fonts'));
});

gulp.task('js', function() {
    return gulp.src([
          './www/js/functions.js',
          './www/js/app.js',
          './www/js/services/*.js',
          './www/js/controllers/*.js',
          './www/js/routes.js',
        ])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./www/js'));
});

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/js/**/*.js']
};

gulp.task('default', ['json-minify','bower', 'js', 'watch']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  // gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
