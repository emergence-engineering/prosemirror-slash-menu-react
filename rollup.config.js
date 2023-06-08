import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";

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
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Include JSX file extension
    }),
    typescript(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/env", "@babel/preset-react"],
    }),
  ],
};
