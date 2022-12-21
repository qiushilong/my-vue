import babel from "rollup-plugin-babel";

export default {
  input: "./src/index.js",
  output: {
    file: "./dist/vue.js",
    name: "Vue", // 在全局上挂在一个 Vue 的全局变量
    format: "umd", // esm es6 commonjs iife umd
    sourcemap: true,
  },
  plugin: [
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
