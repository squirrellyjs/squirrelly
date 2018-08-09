var gulp = require('gulp')
const compiler = require('google-closure-compiler-js').gulp()
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('compress', function () {
  return gulp.src('squirrelly.js')
    // This will minify and rename to foo.min.js
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./'));
});