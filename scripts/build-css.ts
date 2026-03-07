import { mkdir } from "node:fs/promises";

const stylesheetTargets = [
  ["src/styles.css", "dist/styles.css"],
  ["src/styles/theme.css", "dist/styles/theme.css"],
] as const;

for (const [sourcePath, targetPath] of stylesheetTargets) {
  const sourceFile = Bun.file(sourcePath);

  if (!(await sourceFile.exists())) {
    throw new Error(`Missing stylesheet source: ${sourcePath}`);
  }

  const targetDirectoryPath = targetPath.slice(0, targetPath.lastIndexOf("/"));
  await mkdir(targetDirectoryPath, { recursive: true });
  await Bun.write(Bun.file(targetPath), sourceFile);
}
