import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-clear'
import { terser } from 'rollup-plugin-terser'

const dir = 'dist'

export default {
  input: 'src/index.js',
  output: [
    {
      dir,
      format: 'es',
      preserveModules: true,
    },
    {
      format: 'es',
      file: `${dir}/template-instance.min.js`,
    },
    {
      format: 'iife',
      file: `${dir}/template-instance.es5.js`,
    },
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser(),
    clear({ targets: [dir], watch: true })
  ]
}