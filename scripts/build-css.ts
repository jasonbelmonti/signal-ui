import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const stylesheetTargets = [
  ["src/styles.css", "dist/styles.css"],
] as const;

for (const [sourcePath, targetPath] of stylesheetTargets) {
  await copyStylesheet(sourcePath, targetPath);
}

const nestedStylesheetPaths: string[] = [];

for await (const relativePath of new Bun.Glob("**/*.css").scan("src/styles")) {
  nestedStylesheetPaths.push(relativePath);
}

nestedStylesheetPaths.sort();

for (const relativePath of nestedStylesheetPaths) {
  await copyStylesheet(
    join("src/styles", relativePath),
    join("dist/styles", relativePath),
  );
}

async function copyStylesheet(sourcePath: string, targetPath: string) {
  const sourceFile = Bun.file(sourcePath);

  if (!(await sourceFile.exists())) {
    throw new Error(`Missing stylesheet source: ${sourcePath}`);
  }

  const targetDirectoryPath = dirname(targetPath);
  await mkdir(targetDirectoryPath, { recursive: true });
  await Bun.write(Bun.file(targetPath), sourceFile);
}
