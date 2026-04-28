---
name: add-marketplace-plugin
description: Add a Claude Code plugin to the marketplace from a GitHub URL. Use this skill whenever the user provides a GitHub repository URL and asks to add it as a plugin to the claude-code-marketplace. This includes phrases like "add this plugin", "add this repo to marketplace", "register this plugin", or any request containing a github.com URL for a plugin to be added. The skill handles both direct plugin repos and repos that contain a marketplace.json listing multiple plugins with relative or absolute paths.
---

# Add Marketplace Plugin

This skill adds one or more Claude Code plugins to the marketplace from a GitHub URL. The URL might point to a single plugin repo, or to a repo that contains a `marketplace.json` listing multiple plugins.

## Workflow

### Step 0: Check for Commit Intent

At the start, check if the user explicitly asked for a commit/push from the beginning of their request. Phrases like "add and commit", "add this plugin and push", "/add-marketplace-plugin --commit", "please add it and commit" indicate the user wants to commit without being asked.

If the user specified commit intent upfront, plan to commit after making changes without asking. If not specified, proceed through the workflow and ask in Step 8.

### Step 1: Parse the GitHub URL

From the user's input, extract the base GitHub repository in format `owner/repo`.

Examples:
- `https://github.com/KenKaiii/minimal-claude` → `KenKaiii/minimal-claude`
- `github.com/KenKaiii/minimal-claude` → `KenKaiii/minimal-claude`
- `KenKaiii/minimal-claude` → `KenKaiii/minimal-claude`

The base URL for raw file access will be:
```
https://raw.githubusercontent.com/{owner}/{repo}/main
```

### Step 2: Check for a marketplace.json

Before treating the URL as a direct plugin, check if the repo exposes a `marketplace.json`. Try these locations in order using `WebFetch`:

1. `https://raw.githubusercontent.com/{owner}/{repo}/main/.claude-plugin/marketplace.json`
2. `https://raw.githubusercontent.com/{owner}/{repo}/main/marketplace.json`

**If a marketplace.json is found:**

Parse its `plugins` array. Each entry may have a `source` that is:
- An absolute URL: `https://github.com/someone/some-plugin` — use `source: "url"` with that URL
- A relative path: `./my-plugin` or `my-plugin` — this means the plugin lives in a subdirectory of the repo. Resolve to base repo URL + path, but use `source: "git-subdir"` with the base repo URL and the path as the `path` field.
  - Exception: If the relative path is `"./"` (the repo root itself), use `source: "url"` instead, pointing to the base repo URL.
- An absolute URL: `https://github.com/someone/some-plugin` — use `source: "url"` with that URL.

Example resolution:
- Base: `https://github.com/someuser/collection`
- Relative `"./"` → `source: "url"` with `url: "https://github.com/someuser/collection"`
- Relative: `./plugin-a` → `source: "git-subdir"` with `url: "https://github.com/someuser/collection"` and `path: "plugin-a"`
- Relative: `./packages/tool` → `source: "git-subdir"` with `url: "https://github.com/someuser/collection"` and `path: "packages/tool"`

Important: A `git-subdir` source always uses the **base repo URL** (not the subdirectory URL) and a separate `path` field. Never use a GitHub tree/browse URL like `https://github.com/owner/repo/tree/main/subdir` as a source URL.

Present the discovered plugins to the user and ask which ones they want to add to the marketplace. Wait for confirmation before proceeding.

**If no marketplace.json is found:**

Treat the original URL as a single plugin repo and continue with Step 3.

### Step 3: Fetch Plugin Metadata

For each plugin to be added, use `WebFetch` to get information from its GitHub page:
```
https://github.com/{owner}/{repo}
```

If the plugin is a subdirectory within a repo (resolved from a relative path), fetch the parent repo page and note the subdirectory.

Extract:
- **name**: Derive from the leaf repo/path name (e.g., `minimal-claude`, `plugin-a`)
- **description**: From the repo's description or README summary
- **author**: The GitHub owner/organization name
- **topics/keywords**: From repo topics if available
- **license**: If visible on the repo page
- **version**: Check the repo's marketplace.json (either `/.claude-plugin/marketplace.json` or `/marketplace.json`) or README for a version field. Include version if found, omit if not available. Do not invent a version number.

### Step 4: Determine Category

Pick the most appropriate category for each plugin:
- `development` - Developer tools, IDE plugins, code-related
- `productivity` - Tools that improve workflow efficiency
- `security` - Security-focused tools
- `communication` - Communication/messaging tools

Default to `development` unless the plugin clearly fits elsewhere.

### Step 5: Check for Duplicates

Read `.claude-plugin/marketplace.json` and check if a plugin with the same `name` or `repository` URL already exists. If it does, skip it and inform the user.

### Step 6: Update marketplace.json

For each new plugin, add an entry to the `plugins` array in `.claude-plugin/marketplace.json`.

**For direct plugin repos** (the original URL with no marketplace.json found, or an absolute GitHub URL):
```json
{
  "name": "{plugin-name}",
  "source": {
    "source": "url",
    "url": "https://github.com/{owner}/{repo}"
  },
  "description": "{description}",
  "category": "{category}",
  "repository": "https://github.com/{owner}/{repo}",
  "keywords": ["{keyword1}", "{keyword2}"],
  "author": {
    "name": "{author}"
  },
  "license": "{MIT or as-found}",
  "version": "{version or omit if not available}"
}
```

**For plugins from a subdirectory** (resolved from a relative path in a marketplace.json):
```json
{
  "name": "{plugin-name}",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/{owner}/{repo}",
    "path": "{subdirectory}"
  },
  "description": "{description}",
  "category": "{category}",
  "repository": "https://github.com/{owner}/{repo}",
  "keywords": ["{keyword1}", "{keyword2}"],
  "author": {
    "name": "{author}"
  },
  "license": "{MIT or as-found}",
  "version": "{version or omit if not available}"
}
```

Note: Always use the **base repo URL** and a separate `path` field for subdirectory plugins. Never use a GitHub tree URL (e.g. `https://github.com/owner/repo/tree/main/subdir`) as a source URL.

Use `Edit` to insert entries before the closing `]` of the plugins array. Preserve valid JSON — add a comma after the previous last entry.

### Step 7: Update README.md

Read `README.md`, then for each plugin, add a new section at the end of its category. Use this format:

```markdown
### {Plugin Name}

- **Name**: `{plugin-name}`
- **Description**: {description}
- **Category**: {category}
- **Author**: {author}
- **Repository**: <a href="https://github.com/{owner}/{repo}" target="_blank">{owner}/{repo}</a>
- **Keywords**: {keywords}
- **License**: {license}
- **Version**: {version or omit if not available}
- **Installation**:
  ```bash
  /plugin install {plugin-name}@claude-code-awesome
  ```

[← Back to Available Plugins](#-available-plugins)

Add the plugin to the table at the top of `## 🚀 Available Plugins` section, after the last entry. Insert a new row:
```
| [{plugin-name}](#{plugin-name}) | {author} | {short-description} |
```
The short-description should be a brief (under 80 characters) version of the full description, suitable for the table.
```

Insert the section at the end of the appropriate category section (before `## 🔧 Usage`), and also add a row to the plugin table at the top of `## 🚀 Available Plugins`.

### Step 8: Ask or Confirm Before Committing

Show the user a summary of the changes:
- Which plugins were added to `marketplace.json`
- That `README.md` was updated

**If the user specified commit intent in Step 0**, skip this step and proceed directly to Step 9.

**Otherwise**, ask: "Shall I commit and push these changes?" Only proceed if the user confirms.

### Step 9: Commit and Push (only after user confirms)

1. Run `git status` to verify the changed files
2. Run `git add .claude-plugin/marketplace.json README.md`
3. Run `git commit -m "Add {plugin-name(s)} plugin to marketplace"` with Co-Author footer:
   ```
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
4. Run `git push`

### Step 10: Confirm

Tell the user the plugin(s) were added successfully and provide the installation command(s).

## File Paths

- Marketplace manifest: `.claude-plugin/marketplace.json`
- README: `README.md`
- Both files are in the current working directory (claude-code-marketplace repo)

## Edge Cases

- **Multiple plugins from marketplace.json**: Add all confirmed plugins in one commit with a collective message like `"Add 3 plugins from {owner}/{repo} to marketplace"`.
- **Relative path in marketplace.json**: Plugins defined with a relative path like `./my-plugin` use `git-subdir` source type with the base repo URL and the relative path as the `path` field. However, if the relative path is `"./"`, the plugin IS the repo root, so use `source: "url"` with the base repo URL instead. Never use a GitHub tree URL.
- **marketplace.json fetch fails with 404**: The repo doesn't have one — treat as a direct plugin and continue normally.
- **Plugin already exists**: Skip it, note it was already present, and don't update the existing entry.
- **Subdirectory plugins use `git-subdir`**: When a plugin is inside a subdirectory of the source repo, always use `source: "git-subdir"` with the base repo URL and the subdirectory path, not a tree URL.
- **Version not found**: If a plugin has no declared version in its manifest or README, omit the `version` field from the marketplace.json entry. Do not guess or default to "1.0.0".
