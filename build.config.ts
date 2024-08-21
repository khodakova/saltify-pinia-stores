import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
  externals: ['vite'],
  clean: true,
  outDir: "dist",
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
});
