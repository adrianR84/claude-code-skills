#!/usr/bin/env node
/**
 * replicate-skill.js
 * Clones a skill from a GitHub URL into the local skills/ folder.
 *
 * Usage: node replicate-skill.js <url> [dest-root]
 *   dest-root defaults to cwd
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const GITHUB_RAW = 'https://raw.githubusercontent.com';
const GITHUB_API = 'https://api.github.com/repos';

function parseUrl(url) {
  // Handle short form: user/repo/path/to/SKILL.md
  if (!url.includes('://')) {
    const parts = url.split('/');
    return {
      user: parts[0],
      repo: parts[1],
      branch: 'main',
      path: parts.slice(2).join('/'),
    };
  }

  // Handle github.com URLs (blob/ or tree/ or bare repo)
  const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:blob\/|tree\/))?([^?#]*)/);
  if (githubMatch) {
    const [, user, repo, path] = githubMatch;
    const branchMatch = path.match(/^(main|master)\//);
    const branch = branchMatch ? branchMatch[1] : 'main';
    const cleanPath = path.replace(/^(main|master)\//, '');
    return { user, repo, branch, path: cleanPath, repoName: repo };
  }

  // Handle raw.githubusercontent.com
  const rawMatch = url.match(/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^/]+)\/(.+)/);
  if (rawMatch) {
    const [, user, repo, branch, path] = rawMatch;
    return { user, repo, branch, path };
  }

  throw new Error(`Could not parse URL: ${url}`);
}

function deriveSkillName(url) {
  const { path, repoName } = parseUrl(url);
  if (!path || path === '') {
    return repoName;
  }
  const parts = path.split('/');
  if (parts[parts.length - 1] === 'SKILL.md') {
    return parts[parts.length - 2];
  }
  return parts[parts.length - 1];
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchGitHubTree(user, repo, branch, path) {
  const url = `${GITHUB_API}/${user}/${repo}/git/trees/${branch}?recursive=1`;
  const data = await fetchJson(url);
  if (data.message) throw new Error(data.message);

  const prefix = path.endsWith('/') ? path : path + '/';
  const files = data.tree.filter(
    item => item.path.startsWith(prefix) && item.type === 'blob'
  );

  return files.map(f => ({
    path: f.path,
    sha: f.sha,
    relativePath: f.path.slice(prefix.length),
  }));
}

async function fetchFileContent(user, repo, branch, path) {
  const url = `${GITHUB_RAW}/${user}/${repo}/${branch}/${path}`;
  return fetchText(url);
}

function parseSkillReferences(skillContent) {
  const refs = new Set();
  const regex = /(scripts|references|assets|evals)\//g;
  let m;
  while ((m = regex.exec(skillContent)) !== null) {
    refs.add(m[1]);
  }
  return [...refs];
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function saveFile(destRoot, skillName, relativePath, content) {
  const dir = join(destRoot, 'skills', skillName, dirname(relativePath));
  await ensureDir(dir);
  const filePath = join(destRoot, 'skills', skillName, relativePath);
  await writeFile(filePath, content, 'utf8');
  return filePath;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node replicate-skill.js <url> [dest-root]');
    process.exit(1);
  }

  const url = args[0];
  const destRoot = args[1] || process.cwd();

  console.log(`Parsing URL: ${url}`);
  const { user, repo, branch, path } = parseUrl(url);
  const skillName = deriveSkillName(url);

  console.log(`Cloning skill: ${skillName}`);
  console.log(`Source: ${user}/${repo}/${branch}/${path}`);

  const pathParts = path.split('/');
  const skillBasePath = pathParts[pathParts.length - 1] === 'SKILL.md'
    ? pathParts.slice(0, -1).join('/')
    : path;

  const skillMdPath = skillBasePath ? `${skillBasePath}/SKILL.md` : 'SKILL.md';
  console.log(`Fetching SKILL.md from ${skillMdPath}...`);
  const skillContent = await fetchFileContent(user, repo, branch, skillMdPath);

  const skillDir = join(destRoot, 'skills', skillName);
  await ensureDir(skillDir);
  await writeFile(join(skillDir, 'SKILL.md'), skillContent, 'utf8');
  console.log(`Saved SKILL.md`);

  const refs = parseSkillReferences(skillContent);
  console.log(`Found references: ${refs.join(', ') || 'none'}`);

  for (const ref of refs) {
    const remoteDirPath = skillBasePath ? `${skillBasePath}/${ref}` : ref;
    console.log(`Cloning ${ref}/ from ${remoteDirPath}...`);

    try {
      const files = await fetchGitHubTree(user, repo, branch, remoteDirPath);
      console.log(`  Found ${files.length} file(s)`);

      for (const file of files) {
        try {
          const content = await fetchFileContent(user, repo, branch, `${remoteDirPath}/${file.relativePath}`);
          await saveFile(destRoot, skillName, `${ref}/${file.relativePath}`, content);
          console.log(`  Saved ${ref}/${file.relativePath}`);
        } catch (e) {
          console.error(`  Failed to fetch ${file.relativePath}: ${e.message}`);
        }
      }
    } catch (e) {
      console.error(`  Failed to list ${ref}/: ${e.message}`);
    }
  }

  // Clone README.md if it exists
  const readmePath = skillBasePath ? `${skillBasePath}/README.md` : 'README.md';
  console.log(`Checking for README.md at ${readmePath}...`);
  try {
    const readmeContent = await fetchFileContent(user, repo, branch, readmePath);
    await saveFile(destRoot, skillName, 'README.md', readmeContent);
    console.log(`Saved README.md`);
  } catch (e) {
    console.log(`  No README.md found (404 is expected if none exists)`);
  }

  console.log(`\nDone! Skill cloned to skills/${skillName}/`);

  const { readdirSync } = await import('node:fs');
  const items = readdirSync(join(destRoot, 'skills', skillName), { withFileTypes: true });
  for (const item of items) {
    console.log(`  ${item.isDirectory() ? 'd' : '-'} ${item.name}`);
  }
}

main().catch(e => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
