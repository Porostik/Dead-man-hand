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

/** @type {{name:string, prompt:string, image_size?:keyof typeof SIZES}[]} */
const JOBS = [
  {
    name: 'mascot',
    image_size: 'portrait_4_3',
    prompt:
      'Mascot for a Wild-West card crash game "Dead Men". A stylized skeleton ' +
      'gunslinger bust wearing a worn cowboy hat, glowing eyes, holding a fan of ' +
      'playing cards (aces and eights). Warm rust, ember-orange and gold palette ' +
      'on a near-black background, dramatic low rim light, premium mobile game art, ' +
      'clean centered composition, digital illustration, high detail.',
  },
  {
    name: 'gold-ring',
    image_size: 'square_hd',
    prompt:
      'A single ornate gold ring, Wild-West / poker prize style, polished warm ' +
      'gold with subtle engraving, centered on a near-black background, soft ' +
      'dramatic rim light, premium mobile game item icon, high detail, 3D render.',
  },
  {
    name: 'bullets',
    image_size: 'square_hd',
    prompt:
      'A few brass bullet cartridges scattered on a dark worn wooden saloon ' +
      'table, warm gold and rust tones, ember rim light, near-black background, ' +
      'premium Wild-West game art, high detail, slight top-down angle.',
  },
  {
    name: 'coins-hat',
    image_size: 'square_hd',
    prompt:
      'A pile of shiny gold coins with a small black cowboy hat resting on top ' +
      'in the center, warm gold tones, near-black background, soft dramatic ' +
      'light, premium Wild-West game icon, high detail, 3D render.',
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
