import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import css from "rollup-plugin-import-css";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    { file: pkg.module, format: "esm", sourcemap: true },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Include JSX file extension
    }),
    copy({
      targets: [{ src: "src/slashMenuReact/styles/*", dest: "dist/styles" }],
    }),
    css(),
    typescript(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/env", "@babel/preset-react"],
    }),
  ],
};
