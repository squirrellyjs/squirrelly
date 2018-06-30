var gulp = require('gulp');
const compiler = require('google-closure-compiler-js').gulp();

gulp.task('compress', function() {
  return gulp.src('./precomp.js', {base: './'})
      // your other steps here
      .pipe(compiler({
          compilationLevel: 'SIMPLE',
          jsOutputFile: 'precomp.min.js',  // outputs single file
        }))
      .pipe(gulp.dest('./dist'));
});