/**
 * One-shot asset compressor. Converts / recompresses public images to
 * display-sized WebP. Requires `sharp` available locally
 * (`npm i -D sharp` or `npm i --no-save sharp`).
 *
 * Run: npm run compress:assets
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const stats = { before: 0, after: 0, files: [] };

async function sizeOf(file) {
  try {
    return (await fs.stat(file)).size;
  } catch {
    return 0;
  }
}

function kb(n) {
  return `${(n / 1024).toFixed(0)}KB`;
}

async function writeWebp(input, output, { maxEdge, quality }) {
  const before = await sizeOf(input);
  const meta = await sharp(input).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

  let pipeline = sharp(input).rotate();
  if (longest > maxEdge) {
    pipeline = pipeline.resize({
      width: meta.width >= meta.height ? maxEdge : undefined,
      height: meta.height > meta.width ? maxEdge : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  await pipeline.webp({ quality, effort: 6 }).toFile(output);

  const after = await sizeOf(output);
  stats.before += before;
  stats.after += after;
  stats.files.push({
    from: path.relative(publicDir, input),
    to: path.relative(publicDir, output),
    before,
    after,
  });

  if (path.resolve(input) !== path.resolve(output)) {
    await fs.unlink(input).catch(() => {});
  }
}

async function recompressWebp(file, { width, height, quality }) {
  const before = await sizeOf(file);
  const tmp = `${file}.tmp.webp`;
  await sharp(file)
    .rotate()
    .resize({ width, height, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(tmp);
  const after = await sizeOf(tmp);
  await fs.rename(tmp, file);
  stats.before += before;
  stats.after += after;
  stats.files.push({
    from: path.relative(publicDir, file),
    to: path.relative(publicDir, file),
    before,
    after,
  });
}

async function main() {
  const imagesDir = path.join(publicDir, 'images');
  const industriesDir = path.join(imagesDir, 'industries');

  const jpgs = (await fs.readdir(imagesDir))
    .filter((f) => /\.jpe?g$/i.test(f))
    .map((f) => path.join(imagesDir, f));

  for (const file of jpgs) {
    const out = file.replace(/\.jpe?g$/i, '.webp');
    await writeWebp(file, out, { maxEdge: 1400, quality: 78 });
  }

  const industryFiles = (await fs.readdir(industriesDir))
    .filter((f) => f.endsWith('.webp') && !f.endsWith('.tmp.webp'))
    .map((f) => path.join(industriesDir, f));

  for (const file of industryFiles) {
    await recompressWebp(file, { width: 800, height: 1200, quality: 72 });
  }

  for (const { file, maxEdge, quality } of [
    { file: 'osps-logo.webp', maxEdge: 400, quality: 80 },
    { file: 'osps-logo-light.webp', maxEdge: 400, quality: 80 },
    { file: 'osps-mark.webp', maxEdge: 128, quality: 82 },
  ]) {
    await recompressWebp(path.join(publicDir, file), {
      width: maxEdge,
      height: maxEdge,
      quality,
    });
  }

  for (const rel of ['lib/content.ts', 'app/layout.tsx']) {
    const file = path.join(root, rel);
    const text = await fs.readFile(file, 'utf8');
    const next = text.replace(
      /\/images\/([A-Za-z0-9_-]+)\.jpe?g/g,
      '/images/$1.webp'
    );
    if (next !== text) {
      await fs.writeFile(file, next);
      console.log(`updated paths in ${rel}`);
    }
  }

  console.log('\nCompressed files:');
  for (const f of stats.files) {
    const pct = f.before ? Math.round((1 - f.after / f.before) * 100) : 0;
    console.log(
      `  ${f.to.padEnd(48)} ${kb(f.before).padStart(7)} → ${kb(f.after).padStart(7)}  (−${pct}%)`
    );
  }
  if (stats.before) {
    console.log(
      `\nTotal images: ${kb(stats.before)} → ${kb(stats.after)} (−${Math.round(
        (1 - stats.after / stats.before) * 100
      )}%)`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
