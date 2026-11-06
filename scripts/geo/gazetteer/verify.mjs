import assert from "node:assert/strict";
import { loadCityIndex, parseCities } from "./query.mjs";

const index = loadCityIndex();
for (const [name, country, id] of [
  ["北京", "CN", "1816670"],
  ["北京市", "CN", "1816670"],
  ["西安", "CN", "1790630"],
  ["Xi'an", "CN", "1790630"],
  ["罗马", "IT", "3169070"],
  ["PARIS", "FR", "2988507"],
  ["洛阳", "CN", "1801792"],
]) {
  assert(index.find(name, { country }).some(city => city.id === id), name);
}
const london = index.find("伦敦");
assert(london.some(city => city.country === "GB"));
assert(london.some(city => city.country === "CA"));
assert(index.find("伦敦", { country: "gb" }).every(city => city.country === "GB"));
assert(index.find("洛阳", { country: "CN" }).length > 1, "Preserve homonyms within a country");
assert.equal(index.find("长安").length, 0, "Do not invent ancient-name mappings");
assert.equal(index.find("不存在的城市").length, 0);
assert(Object.isFrozen(london) && Object.isFrozen(london[0]) && Object.isFrozen(london[0].altChineseNames));
assert.throws(() => parseCities("bad"));
const header = "id\tname\tcountry\tlon\tlat\tpopulation\taltChineseNames\tasciiName\n";
assert.throws(() => parseCities(header + "1\tCity\tXX\t181\t0\t0\t城市\tCity\n"));
assert.throws(() => parseCities(header + "1\tCity\tXX\t0\t91\t0\t城市\tCity\n"));
console.log(`Verified ${index.size} city records, bilingual lookup, country filters, homonyms and read-only results.`);
