import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import sharp from "sharp";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

const inputDir = "./input";
const outputDir = "./output";
const logFile = "./log.json";

if (!fs.existsSync(inputDir)) fs.mkdirSync(inputDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

let log = [];
if (fs.existsSync(logFile)) {
  try {
    log = JSON.parse(fs.readFileSync(logFile));
  } catch {
    log = [];
  }
}

console.log("👀 Watching for new PNG files in:", inputDir);

const watcher = chokidar.watch(`${inputDir}`, {
  persistent: true,
  ignoreInitial: false,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 200,
  },
});

watcher.on("add", async (filePath) => {
  if (!filePath.toLowerCase().endsWith(".png")) return;

  const fileName = path.basename(filePath, ".png");
  const outputPath = path.join(outputDir, `${fileName}.webp`);

  if (fs.existsSync(outputPath)) {
    console.log(`⚠️ Skipped: ${fileName}.webp already exists`);
    return;
  }

  console.log(`⚙️ Converting: ${fileName}.png → ${fileName}.webp`);

  try {
    const start = Date.now();

    // Step 1: Convert PNG → WebP using TinyPNG-like settings
    await sharp(filePath)
      .webp({
        quality: 95,
        effort: 6,
        nearLossless: false,
        smartSubsample: true,
        chromaSubsampling: "4:2:0",
      })
      .toFile(outputPath);

    // Step 2: Further optimize WebP (optional)
    const optimized = await imagemin([outputPath], {
      destination: outputDir,
      plugins: [
        imageminWebp({
          quality: 95,
          lossless: false,
        }),
      ],
    });

    const end = Date.now();
    const stats = fs.statSync(outputPath);

    const entry = {
      file: `${fileName}.png`,
      converted: `${fileName}.webp`,
      size_kb: (stats.size / 1024).toFixed(1),
      time_ms: end - start,
      optimized: optimized?.length > 0,
      date: new Date().toISOString(),
    };

    log.push(entry);
    fs.writeFileSync(logFile, JSON.stringify(log, null, 2));

    console.log(
      `✅ Done: ${outputPath} (${entry.size_kb} KB, ${entry.time_ms} ms, optimized: ${entry.optimized})`
    );
  } catch (err) {
    console.error(`❌ Error converting ${fileName}:`, err.message);
  }
});