const fs = require("fs");
const path = require("path");

// Determine the source directory containing the frontend files
let sourceDir = "";
if (fs.existsSync(path.join(__dirname, "frontend", "index.html"))) {
  sourceDir = path.join(__dirname, "frontend");
} else if (fs.existsSync(path.join(__dirname, "index.html"))) {
  sourceDir = __dirname;
} else if (fs.existsSync(path.join(__dirname, "..", "frontend", "index.html"))) {
  sourceDir = path.join(__dirname, "..", "frontend");
} else {
  console.error("Could not find frontend directory!");
  process.exit(1);
}

const targetDir = path.join(__dirname, "dist");

// Re-create target directory cleanly
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

// Copy static frontend files to dist
fs.cpSync(sourceDir, targetDir, {
  recursive: true,
  filter: (src) => {
    // Avoid copying test files or dist into itself
    const basename = path.basename(src);
    return basename !== "__tests__" && basename !== "dist";
  },
});

console.log(`Successfully built frontend from ${sourceDir} into ${targetDir}`);
