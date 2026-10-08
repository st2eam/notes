import { readVault } from "./build.mjs";
export default {
  watch: ["../../**/*.md"],
  load() {
    const { search, ...index } = readVault(process.cwd());
    return index;
  },
};
