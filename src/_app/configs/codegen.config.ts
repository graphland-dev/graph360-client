import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: `https://graph-erp-api.graphland.dev/graphql`,
  documents: ["src/**/*.tsx"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/_app/graphql-models/": {
      preset: "client",
    },
  },
};

export default config;