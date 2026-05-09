---
name: replicate-skill
description: |
  Clone a skill from a GitHub URL into the local project's skills/ folder. Use whenever the user says "replicate this skill", "copy this skill from", "clone skill from", "reproduce skill from", or provides a GitHub URL pointing to a skill they want to copy locally. Also triggers when the user mentions downloading or saving a remote skill locally.
---

# Replicate Skill from GitHub

Given a GitHub URL (or raw content URL) pointing to a skill, clones it into `skills/` with all referenced files.

Run: `node skills/replicate-skill/scripts/replicate-skill.js <url> [dest-root]`

## Workflow

### 1. Parse the URL

Accept URLs in these forms:
- `https://github.com/user/repo/blob/main/path/to/SKILL.md`
- `https://raw.githubusercontent.com/user/repo/main/path/to/SKILL.md`
- `https://github.com/user/repo/tree/main/path/to/skill-name` (tree view — derive path from URL)
- Short URLs like `user/repo/path/to/SKILL.md`

Handle both `blob/main` and `blob/master` branches.

### 2. Determine destination

- **Destination root**: `skills/` in the current project root
- **Skill folder name**: derive from the URL path. Examples:
  - `/user/repo/tree/main/skills/skill-name` → `skills/skill-name`
  - `/user/repo/blob/main/src/skill/SKILL.md` → `skills/skill-name` (last path segment before SKILL.md)
- **SKILL.md always saved as**: `skills/<skill-name>/SKILL.md`
- **Referenced subdirs** (scripts/, references/, assets/): saved under `skills/<skill-name>/`

### 3. Fetch and parse SKILL.md

Fetch the raw SKILL.md content. Parse for relative path references:
- `scripts/` → clone the entire scripts/ directory
- `references/` → clone the entire references/ directory
- `assets/` → clone the entire assets/ directory
- Any other relative paths mentioned in the skill

### 4. Clone referenced files

For each referenced directory, construct the GitHub raw URL and fetch recursively:

```
https://raw.githubusercontent.com/{user}/{repo}/{branch}/{skill-path}/{dir}/
```

Clone each file under that directory into the matching local subdirectory.

### 5. Write the local SKILL.md

Save the fetched `SKILL.md` to `skills/<skill-name>/SKILL.md`.

### 6. Verify structure

After cloning, run `ls -la skills/<skill-name>/` to confirm all files landed correctly. Report any failures (e.g. 404 on a referenced file) to the user and continue with what was successful.

## Example

**Input:** User says "replicate https://github.com/anthropics/claude-code/tree/main/skills/summarize-meetings"

**Process:**
1. Parse `anthropics/claude-code/tree/main/skills/summarize-meetings` → skill path is `skills/summarize-meetings`
2. Skill name: `summarize-meetings`
3. Fetch `skills/summarize-meetings/SKILL.md`
4. Parse references → finds `scripts/` and `references/`
5. Clone all files from `scripts/` and `references/` directories
6. Save to `skills/summarize-meetings/`

**Output:** Skill cloned locally, ready to use.
