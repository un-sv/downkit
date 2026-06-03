import { defineBuildConfig } from "obuild/config";
import { dependencies } from "./package.json";
import svelte from "rollup-plugin-svelte";

export default defineBuildConfig({
  entries: [
    {
      input: ["./src/cli.ts", "./src/client.ts"],
      type: "bundle",
      outDir: "dist",
      rolldown: {
        external: [...Object.keys(dependencies)],
        plugins: [svelte({})],
      },
    },
  ],
});
