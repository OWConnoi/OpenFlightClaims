import { readFile } from "node:fs/promises";
import path from "node:path";
import { locales } from "../i18n/locales";

type FlatMessages = Map<string, string>;

async function main() {
  const errors: string[] = [];
  const registeredCodes: string[] = locales.map((locale) => locale.code);
  const englishMessages = flattenMessages(await readMessages("en"));

  for (const locale of locales) {
    const messages = flattenMessages(await readMessages(locale.code));

    for (const key of englishMessages.keys()) {
      if (!messages.has(key)) {
        errors.push(`${locale.code} is missing key ${key}.`);
      }
    }

    for (const key of messages.keys()) {
      if (!englishMessages.has(key)) {
        errors.push(`${locale.code} has unknown key ${key}.`);
      }
    }

    for (const [key, value] of messages.entries()) {
      if (typeof value !== "string" || value.trim().length === 0) {
        errors.push(`${locale.code}.${key} must be a non-empty string.`);
      }
    }
  }

  const messageFiles = ["en", "es", "fr", "ar", "ur"];
  for (const code of messageFiles) {
    if (!registeredCodes.includes(code)) {
      errors.push(`${code} has a message file but is not registered.`);
    }
  }

  if (errors.length > 0) {
    console.error("Translation validation failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log("Translations are valid.");
}

async function readMessages(locale: string) {
  const filePath = path.resolve(process.cwd(), "messages", `${locale}.json`);
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

function flattenMessages(value: unknown, prefix = ""): FlatMessages {
  const flattened: FlatMessages = new Map();

  if (!isRecord(value)) {
    throw new Error(`${prefix || "messages"} must be an object.`);
  }

  for (const [key, child] of Object.entries(value)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;

    if (typeof child === "string") {
      flattened.set(nextPrefix, child);
      continue;
    }

    if (isRecord(child)) {
      for (const [childKey, childValue] of flattenMessages(child, nextPrefix).entries()) {
        flattened.set(childKey, childValue);
      }
      continue;
    }

    flattened.set(nextPrefix, "");
  }

  return flattened;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
