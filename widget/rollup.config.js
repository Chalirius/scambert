import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.tsx', // Entry point of your widget (TypeScript file)
  // ensure dependencies like react are bundled into the output
  external: [],
  output: {
    file: 'dist/bundle.js', // The final output JavaScript file for the browser
    format: 'umd',          // UMD format for browser compatibility
    name: 'ScamducationWidget', // Global variable name
    sourcemap: true,        // Generate source maps for easier debugging
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    typescript({ tsconfig: './tsconfig.json' })
  ]
};