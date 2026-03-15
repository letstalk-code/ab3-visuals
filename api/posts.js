// Returns a sorted JSON list of all blog posts from the /posts directory
import fs   from 'fs';
import path from 'path';

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    fm[key] = val;
  });
  return fm;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const postsDir = path.join(process.cwd(), 'posts');
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    const posts = files.map(file => {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const fm = parseFrontmatter(content);
      return { slug: file.replace(/\.md$/, ''), ...fm };
    }).filter(p => p.title).sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
