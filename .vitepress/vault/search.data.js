import { readVault } from "./build.mjs";
export default {
  watch: ["../../**/*.md"],
  load() {
    return readVault(process.cwd()).search;
  },
};
