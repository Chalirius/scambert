import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

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
  // Silence noisy rollup warnings coming from framer-motion's ESM files
  onwarn(warning, warn) {
    // Ignore module-level directive warnings from framer-motion ("use client")
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && /framer-motion/.test(String(warning.loc?.file))) {
      return
    }
    warn(warning)
  },
  plugins: [
    postcss({ inject: true, minimize: true }),
    resolve({ browser: true }),
    commonjs(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    typescript({ tsconfig: './tsconfig.json' })
  ]
};