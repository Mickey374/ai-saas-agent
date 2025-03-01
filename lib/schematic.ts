import { SchematicClient } from "@schematichq/schematic-typescript-node";

if (!process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_SECRET) {
  throw new Error("NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_SECRET is not defined");
}

export const client = new SchematicClient({
  apiKey: process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_SECRET,
  cacheProviders: {
    flagChecks: [],
  },
});
