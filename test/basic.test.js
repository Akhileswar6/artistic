import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("index.html exists and contains root div", () => {
  const indexPath = path.join(__dirname, "..", "index.html");
  assert.ok(fs.existsSync(indexPath), "index.html should exist");
  const content = fs.readFileSync(indexPath, "utf-8");
  assert.ok(content.includes('id="root"'), 'index.html should contain a div with id="root"');
});

test("package.json has required scripts", () => {
  const pkgPath = path.join(__dirname, "..", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  assert.ok(pkg.scripts.dev, "Should have a dev script");
  assert.ok(pkg.scripts.build, "Should have a build script");
  assert.ok(pkg.scripts.lint, "Should have a lint script");
});

test("vite.config.js exists", () => {
  const vitePath = path.join(__dirname, "..", "vite.config.js");
  assert.ok(fs.existsSync(vitePath), "vite.config.js should exist");
});

test("src directory contains App.jsx", () => {
  const appPath = path.join(__dirname, "..", "src", "App.jsx");
  assert.ok(fs.existsSync(appPath), "src/App.jsx should exist");
});
