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
   /plugin install claude-code-skills
   ```
3. Reload plugins:
   ```
   /reload-plugins
   ```

### Local install

1. Clone the repository:
   ```
   git clone https://github.com/adrianR84/claude-code-skills.git
   cd claude-code-skills
   ```
2. Add the local marketplace:
   ```
   /plugin marketplace add .
   ```
3. Install the plugin:
   ```
   /plugin install claude-code-skills
   ```
4. Reload plugins:
   ```
   /reload-plugins
   ```

### Session-Only (No Install)

```
git clone https://github.com/adrianR84/claude-code-skills.git
cd claude-code-skills
claude --plugin-dir .
```

## Skills

### `import-export-claude-global-profile`

Backup, restore, and diff your Claude Code settings — local or with GitHub sync.

Trigger phrases: "sync claude profile", "backup claude", "restore claude", "compare claude settings"

### `add-marketplace-plugin`

Add a plugin to the marketplace from a GitHub URL.

Trigger phrases: "add this plugin", "add this repo to marketplace"

## Requirements

- Node.js
- Claude Code with plugin support

## License

MIT