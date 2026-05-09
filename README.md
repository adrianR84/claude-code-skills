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
| add-marketplace-plugin | Add a Claude Code plugin to the marketplace from a GitHub URL, or sync versions for all plugins. Trigger when user provides a GitHub URL and asks to add it as a plugin. |
| agents-run | Spawn one or more subagents to work in parallel on the user's request. Use whenever the user asks to "run multiple agents", "parallelize", "spawn agents", "run in parallel", "use multiple agents", or when a task is complex enough to benefit from being split across several autonomous workers. |
| bump-plugin-versions | Bumps version in .claude-plugin/plugin.json and .claude-plugin/marketplace.json. Use whenever you need to increment the version of a Claude Code plugin. |
| daily-ai | Get a daily AI industry digest from curated podcasts, X/Twitter, and blogs. Use whenever someone says "AI digest", "what's happening in AI", "AI news today", "AI updates", or invokes /daily-ai. |
| import-export-claude-global-profile | Export, import, or diff Claude Code global settings. Trigger on "sync claude profile", "backup claude", "restore claude from backup". |
| replicate-skill | Clone a skill from a GitHub URL into the local project's skills/ folder. Use whenever the user says "replicate this skill", "copy this skill from", "clone skill from", "reproduce skill from", or provides a GitHub URL pointing to a skill they want to copy locally. |
| tech-debt-audit | Thorough, user-invoked tech debt and architecture audit of the current codebase. Produces TECH_DEBT_AUDIT.md with file-cited findings, severity, effort estimates, and a required "looks bad but is actually fine" section. Use when the user asks for a debt audit, codebase health check, architecture review, or code quality assessment of an entire repo. |
| toggle-bypassPermissions | Manually invoked only - do not trigger automatically. Toggles bypassPermissions mode in the current project's .claude/settings.local.json. Use when user explicitly says "toggle permissions", "toggle all permissions", "allow all permissions", "allow all perms", or /toggle-bypassPermissions. |

## Requirements

- Node.js
- Claude Code with plugin support

## License

MIT