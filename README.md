# claude-code-skills

A collection of skills for Claude Code.

## Installation

### Marketplace install (recommended)

1. Add the marketplace:
   ```
   /plugin marketplace add adrianR84/claude-code-skills
   ```
2. Install the plugin:
   ```
   claude plugin install claude-code-skills@claude-code-skills
   ```
3. Reload plugins:
   ```
   /reload-plugins
   ```

### Session-Only (No Install)

```
git clone https://github.com/adrianR84/claude-code-skills.git
cd claude-code-skills
claude --plugin-dir .
```

## Available Skills

| Name | Description |
|------|-------------|
| add-marketplace-plugin | Add a Claude Code plugin to the marketplace from a GitHub URL. Trigger when user provides a GitHub URL and asks to add it as a plugin. |
| import-export-claude-global-profile | Export, import, or diff Claude Code global settings. Trigger on "sync claude profile", "backup claude", "restore claude from backup". |

## Requirements

- Node.js
- Claude Code with plugin support

## License

MIT