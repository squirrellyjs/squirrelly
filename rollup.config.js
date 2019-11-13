import { terser } from 'rollup-plugin-terser'

// rollup.config.js (building more than one bundle)

export default [
  {
    input: 'src/index.js',
    output: [{
      file: 'dist/squirrelly.min.js',
      format: 'umd',
      name: 'Sqrl',
      sourcemap: true
    }, {
      file: 'dist/es/squirrelly.min.js',
      format: 'esm',
      sourcemap: true
    }],
    plugins: [terser()]
  },
  {
    input: 'src/index.js',
    output: [{
      file: 'dist/squirrelly.dev.js',
      format: 'umd',
      name: 'Sqrl',
      sourcemap: true
    }, {
      file: 'dist/es/squirrelly.dev.js',
      format: 'esm',
      sourcemap: true
    }],
    plugins: []
  },
  {
    input: 'src/runtime.js',
    output: [{
      file: 'dist/squirrelly.runtime.min.js',
      format: 'umd',
      name: 'Sqrl',
      sourcemap: true
    }, {
      file: 'dist/es/squirrelly.runtime.min.js',
      format: 'esm',
      sourcemap: true
    }],
    plugins: [terser()]
  },
  {
    input: 'src/runtime.js',
    output: [{
      file: 'dist/squirrelly.runtime.dev.js',
      format: 'umd',
      name: 'Sqrl',
      sourcemap: true
    }, {
      file: 'dist/es/squirrelly.runtime.dev.js',
      format: 'esm',
      sourcemap: true
    }],
    plugins: []
  }
]
