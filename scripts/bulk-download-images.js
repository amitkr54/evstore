/**
 * bulk-download-images.js
 * 
 * Reads data.json, finds all products using external image URLs,
 * downloads each image to public/products/, and updates data.json
 * to use the local paths instead.
 * 
 * Run: node scripts/bulk-download-images.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const DATA_PATH = path.join(__dirname, "..", "src", "data", "data.json");
const PRODUCTS_DIR = path.join(__dirname, "..", "public", "products");

// Create products folder if it doesn't exist
if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .slice(0, 50);
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      }
    }, (response) => {
      // Handle redirect
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
      file.on("error", reject);
    });
    request.on("error", reject);
    request.setTimeout(15000, () => { request.destroy(); reject(new Error("Timeout")); });
  });
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`\n📦 Processing ${data.products.length} products...\n`);

  for (const product of data.products) {
    const newImages = [];

    for (let i = 0; i < product.images.length; i++) {
      const imgUrl = product.images[i];

      // Skip if already a local path
      if (imgUrl.startsWith("/products/")) {
        newImages.push(imgUrl);
        skipped++;
        continue;
      }

      // Build a clean local filename
      const ext = imgUrl.includes(".png") ? "png" : imgUrl.includes(".webp") ? "webp" : "jpg";
      const filename = `${slugify(product.brand)}-${slugify(product.name)}-${i + 1}.${ext}`;
      const destPath = path.join(PRODUCTS_DIR, filename);
      const localUrl = `/products/${filename}`;

      // Download the new image, overwriting any old placeholder
      try {
        process.stdout.write(`  ⬇  Downloading: ${filename} ... `);
        await downloadImage(imgUrl, destPath);
        const size = (fs.statSync(destPath).size / 1024).toFixed(0);
        console.log(`✅ ${size}KB`);
        newImages.push(localUrl);
        updated++;
      } catch (err) {
        console.log(`❌ Failed — keeping original URL (${err.message})`);
        newImages.push(imgUrl); // Keep original on failure
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    }

    product.images = newImages;
  }

  // Save updated data.json
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Done!
   Downloaded : ${updated} images
   Already local : ${skipped} images  
   Failed      : ${failed} images (kept external URL)
   
📁 Images saved to: public/products/
📄 data.json updated with local paths
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

main().catch(console.error);
