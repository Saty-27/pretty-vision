import fs from "fs";
import path from "path";
import https from "https";

const assets = [
  // Categories (800x500)
  { name: "cat_optical_frames.jpg", url: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=85" },
  { name: "cat_sunglasses.jpg", url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=85" },
  { name: "cat_bluelight.jpg", url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=85" },
  { name: "cat_sports.jpg", url: "https://images.unsplash.com/photo-1509695503492-413334e2c0ad?auto=format&fit=crop&w=800&q=85" },
  { name: "cat_contacts.jpg", url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=85" },

  // Services (800x600)
  { name: "service_exam.jpg", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=85" },
  { name: "service_prescription.jpg", url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=85" },
  { name: "service_fitting.jpg", url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=85" },
  { name: "service_kids.jpg", url: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=85" },
  { name: "service_coating.jpg", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=85" },

  // Brand Showcase (1600x700)
  { name: "brand_showcase.jpg", url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=85" },

  // Store Visit
  { name: "store_interior.jpg", url: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=1400&q=85" },
  { name: "store_exterior.jpg", url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&q=85" },

  // Gallery (8 tiles)
  { name: "gallery_1.jpg", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85" },
  { name: "gallery_2.jpg", url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=85" },
  { name: "gallery_3.jpg", url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=85" },
  { name: "gallery_4.jpg", url: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=85" },
  { name: "gallery_5.jpg", url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=85" },
  { name: "gallery_6.jpg", url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=85" },
  { name: "gallery_7.jpg", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85" },
  { name: "gallery_8.jpg", url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=85" },

  // Final CTA
  { name: "final_cta.jpg", url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=85" }
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on("finish", () => {
        stream.close();
        resolve();
      });
      stream.on("error", reject);
    }).on("error", reject);
  });
};

async function run() {
  const publicDir = path.resolve("frontend/public");
  const uploadsDir = path.resolve("backend/uploads");

  console.log("Starting high-res optical asset download...");
  for (const item of assets) {
    const dest1 = path.join(publicDir, item.name);
    const dest2 = path.join(uploadsDir, item.name);

    try {
      await download(item.url, dest1);
      fs.copyFileSync(dest1, dest2);
      const stat = fs.statSync(dest1);
      console.log(`✓ Downloaded ${item.name} (${Math.round(stat.size / 1024)} KB)`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.name}:`, err.message);
    }
  }
  console.log("All high-res assets downloaded successfully!");
}

run();
