var gulp     = require('gulp');
var prefixer = require('gulp-autoprefixer');
var cssnano  = require('gulp-cssnano');
var uglify   = require('gulp-uglify');
var eslint   = require('gulp-eslint');
var concat   = require('gulp-concat');
var rename   = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var del      = require('del');

// Paths
var path = {
  dest: {
    css  : 'assets/css/'
  , fonts: 'assets/fonts/'
  , js   : 'assets/js/'
  , img  : 'assets/img/'
  }

, css: [
    'bower_components/normalize-css/normalize.css'
  , 'sources/stylesheets/style.css'
	]

, fonts: [
    'sources/fonts/**/*'
  ]

, js: [
    'bower_components/tether/dist/js/tether.js'
  , 'bower_components/tether-drop/dist/js/drop.js'
  , 'bower_components/tether-tooltip/dist/js/tooltip.js'
  , 'sources/scripts/script.js'
  ]

, img: 'sources/images/**/*'
}

// Stylesheets
gulp.task('stylesheets', ['fonts'], function() {
  return gulp.src(path.css)
    .pipe(prefixer({ browsers: ['> 1%', 'last 2 version'], remove: false }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(path.dest.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest(path.dest.css));
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src(path.fonts)
    .pipe(gulp.dest(path.dest.fonts));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(path.js)
    .pipe(eslint({
      'rules':{
          'quotes': [1, 'single'],
          'semi': [1, 'always']
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(concat('script.js'))
    .pipe(gulp.dest(path.dest.js))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(path.dest.js));
});

// Images
gulp.task('images', function() {
  return gulp.src(path.img)
    .pipe(imagemin())
    .pipe(gulp.dest(path.dest.img));
});

// Clean the final folders
gulp.task('clean', function() {
  return del([
    path.dest.css + '**/*'
  , path.dest.js + '**/*'
  , path.dest.img + '**/*'
  ]);
});

// Watcher
gulp.task('watch', ['clean', 'stylesheets', 'scripts', 'images'], function() {
  gulp.watch('sources/stylesheets/**/*', ['stylesheets']);
  gulp.watch('sources/scripts/**/*', ['scripts']);
  gulp.watch('sources/images/**/*', ['images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('stylesheets', 'scripts', 'images');
});
