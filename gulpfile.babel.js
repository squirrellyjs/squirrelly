import gulp from 'gulp'
import babel from 'gulp-babel'
import sourcemaps from 'gulp-sourcemaps'
import del from 'del'
import { rollup } from 'rollup'

import rollupConfig from './rollup.config'

export async function clean () {
  await del('dist/**/*')
  await del('lib/**/*')
}

export function buildCjs () {
  return gulp
    .src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('lib'))
}

export async function buildUmd () {
  for (const config of rollupConfig) {
    const bundle = await rollup(config)

    await bundle.write(config.output)
  }
}

export const build = gulp.series([clean, buildCjs, buildUmd])
