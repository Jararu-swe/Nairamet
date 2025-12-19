const fs = require("fs");
const path = require("path");

function walk(dir, exts = [".tsx", ".md", ".mdx", ".html"]) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...walk(filePath, exts));
    } else {
      if (exts.includes(path.extname(filePath))) results.push(filePath);
    }
  }
  return results;
}

function stripTags(s) {
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/\{\{[\s\S]*?\}\}/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/.*$/gm, " ")
    .replace(/\$\{[^}]*\}/g, " ");
}

function countWords(s) {
  if (!s) return 0;
  const words = s.replace(/\s+/g, " ").trim();
  if (!words) return 0;
  return words.split(" ").filter(Boolean).length;
}

function analyzeFiles(root) {
  const files = walk(root);
  const report = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, "utf8");
      // Remove import/export and JSX tags to approximate visible text
      const text = stripTags(raw);
      const words = countWords(text);
      report.push({ file: path.relative(process.cwd(), file), words });
    } catch (e) {
      // ignore
    }
  }
  return report;
}

function main() {
  const root = path.join(process.cwd(), "app");
  if (!fs.existsSync(root)) {
    console.error("No app/ directory found.");
    process.exit(1);
  }

  const report = analyzeFiles(root);
  report.sort((a, b) => a.words - b.words);
  const low = report.filter((r) => r.words < 150);
  const out = {
    scanned: report.length,
    lowContentCount: low.length,
    lowContentFiles: low,
    allFiles: report,
  };
  fs.writeFileSync(
    path.join(process.cwd(), "tools", "content-report.json"),
    JSON.stringify(out, null, 2)
  );
  console.log(
    `Scanned ${out.scanned} files. ${out.lowContentCount} files under 150 words.`
  );
  if (out.lowContentCount > 0) {
    console.log("Files with low content:");
    out.lowContentFiles.forEach((f) =>
      console.log(`${f.file} — ${f.words} words`)
    );
  }
}

main();
