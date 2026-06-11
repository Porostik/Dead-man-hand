/**
 * Offline image generation for the game's art assets → docs/design/generated/.
 *
 * Two providers:
 *   - pollinations (DEFAULT): FREE, no API key. https://pollinations.ai
 *   - fal:        higher quality, paid. Needs FAL_KEY (https://fal.ai/dashboard/keys)
 *
 * Run (free):       node tools/gen-images.mjs
 *   only some:      node tools/gen-images.mjs mascot
 * Run (fal, paid):  PROVIDER=fal node --env-file=.env tools/gen-images.mjs
 *
 * Edit JOBS to change prompts / sizes.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs/design/generated');
const PROVIDER = process.env.PROVIDER || 'pollinations';

const SIZES = {
  square_hd: [1024, 1024],
  portrait_4_3: [768, 1024],
  portrait_16_9: [720, 1280],
  landscape_16_9: [1280, 720],
};

// Shared style so the whole set is visually consistent and easy to composite.
// Pure-black bg + isolated/centered subject → drops onto the dark felt cleanly
// via mix-blend-mode: screen/lighten (flux has no real alpha channel).
const STYLE =
  'warm rust, ember-orange and antique-gold palette, glowing embers, dramatic ' +
  'low rim light, centered isolated subject on a pure black background, premium ' +
  'Wild-West mobile game art, highly detailed digital illustration, no text, no border';

/** @type {{name:string, prompt:string, image_size?:keyof typeof SIZES}[]} */
const JOBS = [
  {
    name: 'mascot',
    image_size: 'portrait_4_3',
    prompt:
      'Mascot for a Wild-West card-crash game "Dead Men": a skeletal bony hand ' +
      'of death rising up from below, bare weathered bone fingers, fanning out a ' +
      'spread of old worn playing cards, tattered dark leather sleeve cuff at the ' +
      'wrist. ' + STYLE,
  },
  {
    name: 'gold-ring',
    image_size: 'square_hd',
    prompt:
      'A single ornate gold ring standing upright, Wild-West poker prize, ' +
      'polished antique gold with subtle engraving. ' + STYLE,
  },
  {
    name: 'gold-coins',
    image_size: 'square_hd',
    prompt:
      'A neat pile of shiny gold coins, Wild-West saloon style, bright golden ' +
      'highlights, 3D render. ' + STYLE,
  },
  {
    name: 'bullets',
    image_size: 'square_hd',
    prompt:
      'A small group of three brass bullet cartridges standing and lying ' +
      'together, gold and rust tones, 3D render. ' + STYLE,
  },
  // "что-то ещё" candidates — run explicitly: node tools/gen-images.mjs sheriff-badge revolver poker-chips
  {
    name: 'sheriff-badge',
    image_size: 'square_hd',
    prompt:
      'A six-point sheriff star badge in polished antique gold with subtle ' +
      'engraving, Wild-West style, 3D render. ' + STYLE,
  },
  {
    name: 'revolver',
    image_size: 'square_hd',
    prompt:
      'A single ornate Wild-West revolver, engraved antique-gold and gunmetal ' +
      'finish, 3D render. ' + STYLE,
  },
  {
    name: 'poker-chips',
    image_size: 'square_hd',
    prompt:
      'A small stack of poker chips in black, gold and deep red, Wild-West ' +
      'saloon style, 3D render. ' + STYLE,
  },
];

async function pollinations(job) {
  const [w, h] = SIZES[job.image_size || 'square_hd'];
  const token = process.env.POLLINATIONS_TOKEN; // free token: https://enter.pollinations.ai
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(job.prompt)}` +
    `?width=${w}&height=${h}&model=flux&nologo=true&seed=${Math.floor(Math.random() * 1e6)}`;
  const res = await fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  if (!res.ok) {
    throw new Error(
      `pollinations ${res.status}` +
        (res.status === 402
          ? ' — anonymous tier is rate-limited; set POLLINATIONS_TOKEN (free, https://enter.pollinations.ai)'
          : ''),
    );
  }
  return Buffer.from(await res.arrayBuffer());
}

async function falGen(job) {
  if (!process.env.FAL_KEY) throw new Error('FAL_KEY not set (use a .env file)');
  const { fal } = await import('@fal-ai/client');
  const result = await fal.subscribe('fal-ai/flux/schnell', {
    input: { prompt: job.prompt, image_size: job.image_size || 'square_hd', num_images: 1 },
  });
  const image = result?.data?.images?.[0] || result?.images?.[0];
  if (!image?.url) throw new Error('no image in fal result');
  return Buffer.from(await (await fetch(image.url)).arrayBuffer());
}

async function run() {
  const only = process.argv.slice(2);
  const jobs = only.length ? JOBS.filter((j) => only.includes(j.name)) : JOBS;
  if (!jobs.length) {
    console.error('No matching jobs. Available:', JOBS.map((j) => j.name).join(', '));
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`provider: ${PROVIDER}`);

  for (const job of jobs) {
    console.log(`\n▸ ${job.name}`);
    try {
      const bytes =
        PROVIDER === 'fal' ? await falGen(job) : await pollinations(job);
      const file = join(OUT_DIR, `${job.name}.png`);
      await writeFile(file, bytes);
      console.log(`  ✓ saved ${file} (${(bytes.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`  ✖ ${job.name}: ${e?.message || e}`);
    }
  }
  console.log('\nDone.');
}

run().catch((e) => {
  console.error('✖ failed:', e?.message || e);
  process.exit(1);
});
