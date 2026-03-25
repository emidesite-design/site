import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, ".env");
const outputDir = path.join(projectRoot, "public", "data");
const outputFile = path.join(outputDir, "presskit.json");

function parseEnvFile(content) {
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function loadLocalEnv() {
  try {
    const content = await fs.readFile(envPath, "utf8");
    parseEnvFile(content);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
}

function getManifestUrl() {
  const manifestUrl =
    process.env.SUPABASE_PRESSKIT_MANIFEST_URL || process.env.VITE_SUPABASE_PRESSKIT_URL;

  if (!manifestUrl) {
    throw new Error(
      "Missing Supabase manifest URL. Set SUPABASE_PRESSKIT_MANIFEST_URL or VITE_SUPABASE_PRESSKIT_URL.",
    );
  }

  return manifestUrl;
}

function isValidPayload(payload) {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      "images" in payload &&
      Array.isArray(payload.images),
  );
}

async function main() {
  await loadLocalEnv();

  const manifestUrl = getManifestUrl();
  const response = await fetch(manifestUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch Supabase presskit manifest: ${response.status}`);
  }

  const payload = await response.json();

  if (!isValidPayload(payload)) {
    throw new Error("Invalid presskit manifest format.");
  }

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `Synced ${payload.images.length} presskit image(s) to ${path.relative(projectRoot, outputFile)}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
