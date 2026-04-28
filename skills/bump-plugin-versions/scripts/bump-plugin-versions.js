#!/usr/bin/env node
// bump-plugin-versions.js
// Bumps version in .claude-plugin/plugin.json and .claude-plugin/marketplace.json

const fs = require("fs");
const path = require("path");

const PLUGIN_DIR = ".claude-plugin";
const FILES = ["marketplace.json", "plugin.json"];

function bumpVersion(content) {
  const json = JSON.parse(content);
  if (!json.version) {
    json.version = "1.0.0";
  } else {
    const parts = json.version.split(".");
    parts[2] = String(parseInt(parts[2], 10) + 1);
    json.version = parts.join(".");
  }
  return JSON.stringify(json, null, 2) + "\n";
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, "utf8");
  const updated = bumpVersion(content);
  fs.writeFileSync(filePath, updated);
  return true;
}

const cwd = process.cwd();
let modified = false;

for (const file of FILES) {
  const filePath = path.join(cwd, PLUGIN_DIR, file);
  if (processFile(filePath)) {
    console.error(`Bumped version in ${PLUGIN_DIR}/${file}`);
    modified = true;
  }
}

process.exit(modified ? 0 : 1);