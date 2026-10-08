import test from "node:test";
import assert from "node:assert/strict";
import {
  embedOptions,
  embedHref,
  validEmbedMessage,
} from "../.vitepress/vault/embed.mjs";

test("embed options default to transparent auto theme and validate parent origin", () => {
  assert.deepEqual(
    embedOptions(
      "?embed=true",
      "https://parent.example/page",
      "https://notes.example",
    ),
    {
      theme: "auto",
      background: "transparent",
      parentOrigin: "https://parent.example",
    },
  );
  assert.equal(embedOptions("?theme=dark&background=theme").theme, "dark");
  assert.equal(
    embedOptions(
      "?theme=invalid&parentOrigin=javascript:alert(1)",
      "",
      "https://notes.example",
    ).parentOrigin,
    "https://notes.example",
  );
});
test("embed configuration only accepts valid messages from the trusted parent", () => {
  const parent = {};
  const event = {
    source: parent,
    origin: "https://parent.example",
    data: { type: "notes:embed-config", theme: "dark", background: "theme" },
  };
  assert.ok(validEmbedMessage(event, parent, "https://parent.example"));
  assert.ok(!validEmbedMessage({ ...event, source: {} }, parent, event.origin));
  assert.ok(
    !validEmbedMessage(
      { ...event, origin: "https://other.example" },
      parent,
      event.origin,
    ),
  );
  assert.ok(
    !validEmbedMessage(
      { ...event, data: { ...event.data, background: "url(secret)" } },
      parent,
      event.origin,
    ),
  );
});
test("embed navigation retains theme, background, parent origin and anchors", () => {
  const href = embedHref(
    "/历史/分期/古典时期.html?view=graph#思想",
    "?theme=dark&background=theme&parentOrigin=https%3A%2F%2Fparent.example",
  );
  const url = new URL(href, "https://notes.example");
  assert.equal(url.searchParams.get("embed"), "true");
  assert.equal(url.searchParams.get("theme"), "dark");
  assert.equal(url.searchParams.get("background"), "theme");
  assert.equal(url.searchParams.get("parentOrigin"), "https://parent.example");
  assert.equal(url.searchParams.get("view"), "graph");
  assert.equal(decodeURIComponent(url.hash), "#思想");
});
