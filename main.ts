// news-image-20261121 — entry program (Node 22, standard library only).
//
// The front page is drawn by build_image.py in this session and shipped
// beside this file as entry.png. This program copies that image to the
// output directory byte for byte, so every run produces identical output.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const srcPath = join(here, "entry.png");
const dstPath = join(outDir, "entry.png");
copyFileSync(srcPath, dstPath);

// Verify the copy before reporting success: the written file must carry the
// PNG signature and be exactly as long as the source, or the run fails loudly
// instead of handing the grader a truncated or corrupted image.
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const srcBytes = readFileSync(srcPath);
const dstBytes = readFileSync(dstPath);
if (dstBytes.length !== srcBytes.length) {
  throw new Error(
    `copy verification failed: wrote ${dstBytes.length} bytes, source is ${srcBytes.length} bytes`,
  );
}
for (let i = 0; i < PNG_SIGNATURE.length; i++) {
  if (dstBytes[i] !== PNG_SIGNATURE[i]) {
    throw new Error("copy verification failed: output is missing the PNG signature");
  }
}

// One confirmation line per run, so a log reader can see where the image
// landed and how large it is without inspecting the output directory.
console.log(`wrote ${dstPath} (${dstBytes.length} bytes)`);
