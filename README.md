# claude-code-skills

A collection of skills for Claude Code.

## Installation

### Marketplace install (recommended)

1. Add the marketplace:
   ```
   claude plugin marketplace add adrianR84/claude-code-skills
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
| agents-run | Spawn one or more subagents to work in parallel on the user's request. Use whenever the user asks to "run multiple agents", "parallelize", "spawn agents", "run in parallel", "use multiple agents", or when a task is complex enough to benefit from being split across several autonomous workers. |
| daily-ai | Get a daily AI industry digest from curated podcasts, X/Twitter, and blogs. Use whenever someone says "AI digest", "what's happening in AI", "AI news today", "AI updates", or invokes /daily-ai. |
| import-export-claude-global-profile | Export, import, or diff Claude Code global settings. Trigger on "sync claude profile", "backup claude", "restore claude from backup". |
| toggle-bypassPermissions | Manually invoked only - do not trigger automatically. Toggles bypassPermissions mode in the current project's .claude/settings.local.json. Use when user explicitly says "toggle permissions", "toggle all permissions", "allow all permissions", "allow all perms", or /toggle-bypassPermissions. |

## Requirements

- Node.js
- Claude Code with plugin support

## License

MIT