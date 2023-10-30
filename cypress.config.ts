import { defineConfig } from "cypress";
import clipboardy from "clipboardy";
import * as fs from "fs";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
          // tsconfig: "./tsconfig.json",
        })
      );
      // on('after:run', (results) => {});
      on("task", {
        // Clipboard test plugin
        getClipboard: () => {
          const clipboard = clipboardy.readSync();
          return clipboard;
        },
        // reset for timeout
        writeFile({ filename, data }) {
          fs.writeFileSync(filename, data);
          return null;
        },
      });
      return config;
    },
    specPattern: "cypress-client/integration/features/**/*.spec.{js,feature}",
    fixturesFolder: "cypress-client/fixtures",
    supportFile: "cypress-client/support/e2e.ts",
    numTestsKeptInMemory: 0,
    video: false,
    redirectionLimit: 3,
    testIsolation: false,
    experimentalMemoryManagement: true,
  },
});
