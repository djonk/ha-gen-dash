import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const dev = process.env.NODE_ENV === 'development';

export default {
  input: 'src/gen-dash-card.ts',
  output: {
    file: 'dist/gen-dash-card.js',
    format: 'es',
    sourcemap: dev,
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: dev,
      inlineSources: dev,
    }),
    !dev && terser({
      compress: {
        drop_console: true,
      },
      output: {
        comments: false,
      },
    }),
  ].filter(Boolean),
  external: [],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
  },
}; 