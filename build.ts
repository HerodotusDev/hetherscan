import { cpSync, mkdirSync, readdirSync, watch } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, "src");
const publicDir = join(__dirname, "public");
const distDir = join(__dirname, "dist");

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir, { withFileTypes: true });

  files.forEach((file) => {
    const filePath = join(dir, file.name);
    if (file.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

async function build() {
  const allSrcFiles = getAllFiles(srcDir);
  const entrypoints = allSrcFiles.filter((file) => (file.endsWith(".ts") || file.endsWith(".js")) && !file.endsWith(".d.ts"));

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
