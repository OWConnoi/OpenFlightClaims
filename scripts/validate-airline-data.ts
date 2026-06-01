import { AIRLINES_FILE, readJsonFile, validateAirlineRecords } from "./lib/airline-records";

async function main() {
  const records = await readJsonFile<unknown>(AIRLINES_FILE, []);
  const errors = validateAirlineRecords(records);

  if (errors.length > 0) {
    console.error("Airline data validation failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log("Airline data is valid.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
