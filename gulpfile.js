var gulp = require('gulp')
const compiler = require('google-closure-compiler-js').gulp()

gulp.task('compress', function () {
  return gulp.src('./squirrelly.js', {base: './'})
      // your other steps here
      .pipe(compiler({
        compilationLevel: 'SIMPLE',
        jsOutputFile: 'squirrelly.min.js'  // outputs single file
      }))
      .pipe(gulp.dest('./'))
})
