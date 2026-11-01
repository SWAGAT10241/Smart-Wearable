const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const checkSymbols = [
  { symbol: "Platform", usage: /\bPlatform\b/ },
  { symbol: "Dimensions", usage: /\bDimensions\.(get|addEventListener)\b/ },
  { symbol: "Alert", usage: /\bAlert\.(alert|prompt)\b/ },
  { symbol: "KeyboardAvoidingView", usage: /<KeyboardAvoidingView\b/ },
  { symbol: "ScrollView", usage: /<ScrollView\b/ },
  { symbol: "ActivityIndicator", usage: /<ActivityIndicator\b/ },
  { symbol: "Modal", usage: /<Modal\b/ },
  { symbol: "RefreshControl", usage: /<RefreshControl\b/ },
];

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

      // Check for missing React Native imports in src/
      if (fullPath.includes("/src/")) {
        const code = fs.readFileSync(fullPath, "utf8");
        for (const item of checkSymbols) {
          if (item.usage.test(code)) {
            const importPattern = new RegExp(`import\\s+{[^}]*\\b${item.symbol}\\b[^}]*}\\s+from\\s+["']react-native["']`);
            const localDecl = new RegExp(`\\b(const|let|var|function|class)\\s+${item.symbol}\\b`);
            if (!importPattern.test(code) && !localDecl.test(code)) {
              if (code.includes("react-native")) {
                throw new Error(`Missing '${item.symbol}' import in ${path.relative(rootDir, fullPath)}`);
              }
            }
          }
        }
      }

      count++;
    }
  }
  return count;
}

const rootDir = path.resolve(__dirname, "..");
const total = checkDir(rootDir);
console.log(`✓ Validated syntax and imports across ${total} mobile JavaScript files.`);
