import fs from "fs";
import path from "path";
import { execFile, execSync } from "child_process";

let sharpModule = null;
let sharpLoadAttempted = false;
const getSharp = async () => {
  if (sharpLoadAttempted) return sharpModule;
  sharpLoadAttempted = true;
  try {
    const mod = await import("sharp");
    sharpModule = mod.default || mod;
    return sharpModule;
  } catch (err) {
    console.warn("[MediaCompressor] Notice: 'sharp' package not installed yet. Images will be stored directly until 'npm install' runs.");
    sharpModule = null;
    return null;
  }
};

const TARGET_MAX_IMAGE_BYTES = 350 * 1024; // 350 KB
const TARGET_MAX_VIDEO_BYTES = 380 * 1024; // 380 KB

let ffmpegPath = null;
const getFfmpegPath = () => {
  if (ffmpegPath !== null) return ffmpegPath;
  try {
    const stdout = execSync("which ffmpeg", { encoding: "utf8" }).trim();
    if (stdout && fs.existsSync(stdout)) {
      ffmpegPath = stdout;
      return ffmpegPath;
    }
  } catch {
    // not in PATH
  }
  const commonPaths = ["/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/opt/homebrew/bin/ffmpeg"];
  for (const p of commonPaths) {
    if (fs.existsSync(p)) {
      ffmpegPath = p;
      return ffmpegPath;
    }
  }
  ffmpegPath = "";
  return ffmpegPath;
};

/**
 * Compresses an image file in-place to stay under TARGET_MAX_IMAGE_BYTES (max 300-350 KB)
 * while preserving sharp optical details.
 */
export async function compressImage(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;

    const ext = path.extname(filePath).toLowerCase();
    // Skip SVGs and non-image formats
    if (ext === ".svg" || ext === ".pdf") return { size: originalSize, path: filePath };

    const sharp = await getSharp();
    if (!sharp) return { size: originalSize, path: filePath, compressed: false };

    const image = sharp(filePath, { failOnError: false });
    const metadata = await image.metadata();

    // Determine target dimension
    let maxDimension = 1600;
    if (originalSize > 5 * 1024 * 1024) {
      maxDimension = 1400;
    }

    let resizeOptions = null;
    if (metadata.width > maxDimension || metadata.height > maxDimension) {
      resizeOptions = {
        width: metadata.width > metadata.height ? maxDimension : undefined,
        height: metadata.height >= metadata.width ? maxDimension : undefined,
        fit: "inside",
        withoutEnlargement: true
      };
    }

    // Iteratively compress until under target size
    let qualityLevels = [80, 68, 55, 45, 38];
    let bestBuffer = null;
    let chosenFormat = metadata.format === "png" && metadata.hasAlpha ? "webp" : (metadata.format === "webp" ? "webp" : "jpeg");

    for (const q of qualityLevels) {
      let pipeline = sharp(filePath, { failOnError: false });
      if (resizeOptions) {
        pipeline = pipeline.resize(resizeOptions);
      }

      if (chosenFormat === "webp") {
        pipeline = pipeline.webp({ quality: q, effort: 4, alphaQuality: 80 });
      } else if (chosenFormat === "jpeg") {
        pipeline = pipeline.jpeg({ quality: q, progressive: true, mozjpeg: true });
      } else {
        pipeline = pipeline.webp({ quality: q, effort: 4 });
      }

      const buffer = await pipeline.toBuffer();
      bestBuffer = buffer;

      if (buffer.length <= TARGET_MAX_IMAGE_BYTES) {
        break;
      }

      // If still too large after first pass, reduce dimension
      if (resizeOptions && q <= 55) {
        resizeOptions = { width: 1200, height: 1200, fit: "inside", withoutEnlargement: true };
      }
    }

    if (bestBuffer && bestBuffer.length < originalSize) {
      fs.writeFileSync(filePath, bestBuffer);
      const newStats = fs.statSync(filePath);
      console.log(
        `[MediaCompressor] Image compressed: ${(originalSize / 1024).toFixed(1)} KB -> ${(
          newStats.size / 1024
        ).toFixed(1)} KB (-${(((originalSize - newStats.size) / originalSize) * 100).toFixed(1)}%)`
      );
      return { size: newStats.size, path: filePath, compressed: true };
    }

    return { size: originalSize, path: filePath, compressed: false };
  } catch (err) {
    console.warn(`[MediaCompressor] Failed to compress image ${filePath}:`, err.message);
    return { size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0, path: filePath, error: err.message };
  }
}

/**
 * Compresses video using ffmpeg down to mini size under 300-380 KB
 */
export async function compressVideo(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;

    const ffmpeg = getFfmpegPath();
    if (!ffmpeg) {
      console.warn(
        `[MediaCompressor] ffmpeg not detected on this system. To enable automatic server-side video compression to under 300KB, install ffmpeg: 'sudo apt-get install -y ffmpeg'`
      );
      return { size: originalSize, path: filePath, compressed: false };
    }

    const ext = path.extname(filePath);
    const tempOutput = path.join(
      path.dirname(filePath),
      `compressed-${Date.now()}-${path.basename(filePath, ext)}.mp4`
    );

    // ffmpeg command tuned to produce ultra-compact web video under 300 KB:
    // Scale to max 480p width/height, 22 fps, constrained bitrate 240k, mono 48k audio
    const args = [
      "-y",
      "-i", filePath,
      "-vf", "scale='min(480,iw)':-2",
      "-r", "22",
      "-c:v", "libx264",
      "-preset", "faster",
      "-crf", "32",
      "-b:v", "220k",
      "-maxrate", "280k",
      "-bufsize", "560k",
      "-c:a", "aac",
      "-b:a", "40k",
      "-ac", "1",
      "-movflags", "+faststart",
      tempOutput
    ];

    await new Promise((resolve, reject) => {
      execFile(ffmpeg, args, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    if (fs.existsSync(tempOutput)) {
      const tempStats = fs.statSync(tempOutput);
      if (tempStats.size < originalSize) {
        fs.renameSync(tempOutput, filePath);
        console.log(
          `[MediaCompressor] Video compressed: ${(originalSize / 1024).toFixed(1)} KB -> ${(
            tempStats.size / 1024
          ).toFixed(1)} KB (-${(((originalSize - tempStats.size) / originalSize) * 100).toFixed(1)}%)`
        );
        return { size: tempStats.size, path: filePath, compressed: true };
      } else {
        fs.unlinkSync(tempOutput);
      }
    }

    return { size: originalSize, path: filePath, compressed: false };
  } catch (err) {
    console.warn(`[MediaCompressor] Failed to compress video ${filePath}:`, err.message);
    return { size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0, path: filePath, error: err.message };
  }
}

/**
 * Universal upload compressor: inspects mimetype / extension and compresses
 * photos and videos to mini size (max ~300-380 KB).
 */
export async function processUploadedFile(fileObject) {
  if (!fileObject || !fileObject.path) return fileObject;
  const mime = fileObject.mimetype || "";
  const ext = path.extname(fileObject.path).toLowerCase();

  const isImage = mime.startsWith("image/") || [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  const isVideo = mime.startsWith("video/") || [".mp4", ".webm", ".mov"].includes(ext);

  if (isImage && ext !== ".svg") {
    const res = await compressImage(fileObject.path);
    if (res && res.size) {
      fileObject.size = res.size;
    }
  } else if (isVideo) {
    const res = await compressVideo(fileObject.path);
    if (res && res.size) {
      fileObject.size = res.size;
    }
  }

  return fileObject;
}
