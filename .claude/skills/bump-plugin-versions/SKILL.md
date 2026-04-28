---
name: bump-plugin-versions
description: |
  Bumps version in .claude-plugin/plugin.json and .claude-plugin/marketplace.json. Use whenever you need to increment the version of a Claude Code plugin. Example: "bump the version" or "update plugin version"
---

# Bump Plugin Versions

Increments patch version in plugin metadata files.

Run: `node skills/bump-plugin-versions/scripts/bump-plugin-versions.js`

- `1.0.0` → `1.0.1`, etc.
- Sets to `1.0.0` if no version exists.
- Exit code 0 on success, 1 if no files found.