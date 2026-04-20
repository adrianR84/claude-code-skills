---
description: Display and add to README a table of all available skills
---

# Read Skills

Scans the `skills/` folder, extracts all skill metadata, and generates a tabular overview added to README.md.

## Steps

### 1. Find All Skills

Use Glob to locate all `SKILL.md` files:
- Pattern: `skills/*/SKILL.md`
- Also check nested: `skills/**/SKILL.md`

### 2. Extract Skill Metadata

For each `SKILL.md` found, read the file and extract:
- **Name**: From `name:` in frontmatter (or derive from folder name if missing)
- **Description**: From `description:` in frontmatter

### 3. Generate Skill Table

Build a markdown table with columns:

| Name | Description |
|------|-------------|
| skill-name | Skill description text |

- Use the skill folder name as name if frontmatter `name:` is missing
- Sort alphabetically by name
- Ensure description column is properly padded and aligned

### 4. Update README.md

1. Check if `README.md` exists in current directory
2. If a skill table section already exists (look for `## Skills` or `## Available Skills`), replace it
3. If no section exists, add the table after the title/intro section
4. Format:

```markdown
## Available Skills

| Name | Description |
|------|-------------|
| skill-name | Skill description |
| another-skill | Another description |
```

### 5. Display Output

After updating README, show the table in the chat:

```
Available Skills:
| Name | Description |
|------|-------------|
| skill-name | Description |
```

## Notes

- Handle gracefully if no skills are found (show "No skills found" message)
- If SKILL.md has no frontmatter or name/description, use folder name and "No description"
- Do NOT modify any skill files, only read them
- The README update should preserve all other README content