import { terser } from 'rollup-plugin-terser'

// rollup.config.js (building more than one bundle)

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/squirrelly.min.js',
      format: 'umd',
      name: 'Sqrl',
      sourcemap: true
    },
    plugins: [terser()]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/squirrelly.dev.js',
      format: 'umd',
      name: 'Sqrl',
      sourcemap: true
    },
    plugins: []
  },
  {
    input: 'src/runtime.js',
    output: {
      file: 'dist/squirrelly.runtime.min.js',
      format: 'umd',
      name: 'Sqrl',
      sourcemap: true
    },
    plugins: [terser()]
  },
  {
    input: 'src/runtime.js',
    output: {
      file: 'dist/squirrelly.runtime.dev.js',
      format: 'umd',
      name: 'Sqrl',
      sourcemap: true
    },
    plugins: []
  }
]
