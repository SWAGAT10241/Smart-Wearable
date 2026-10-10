const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function checkDir(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== "node_modules" &&
        entry.name !== ".expo" &&
        entry.name !== "dist" &&
        entry.name !== ".git"
      ) {
        count += checkDir(fullPath);
      }
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") || entry.name.endsWith(".jsx"))
    ) {
      execSync(`node --check "${fullPath}"`);
      count++;
    }
  }
  return count;
}

const rootDir = path.resolve(__dirname, "..");
const total = checkDir(rootDir);
console.log(`✓ Validated syntax across ${total} mobile JavaScript files.`);
