import { readdirSync, mkdirSync, cpSync, watch } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, "src");
const publicDir = join(__dirname, "public");
const distDir = join(__dirname, "dist");

async function build() {
  const entrypoints = readdirSync(srcDir)
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"))
    .map((file) => join(srcDir, file));

  await Bun.build({
    entrypoints,
    outdir: distDir,
    splitting: false,
    sourcemap: "external",
    target: "browser",
    minify: false,
  });

  mkdirSync(distDir, { recursive: true });
  cpSync(publicDir, distDir, { recursive: true });

  console.log("✅ Build complete.");
}

const watching = process.argv.includes("--watch");
await build();

if (watching) {
  console.log("Watching for changes in src and public...");

  const watchDirs = [srcDir, publicDir];
  watchDirs.forEach((dir) => {
    watch(dir, { recursive: true }, async (event, filename) => {
      if (filename) {
        console.log(`File changed: ${filename}, rebuilding...`);
        await build();
      }
    });
  });
}
