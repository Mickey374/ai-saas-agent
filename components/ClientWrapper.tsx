"use client";

import type { Metadata } from "next";
import { SchematicProvider } from "@schematichq/schematic-react";
import SchematicWrapped from "./SchematicWrapped";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "Client Wrapper Component",
  description: "Sleek and Unique Client Wrapper Component",
};

export default function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schematicPublishableKey =
    process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY;
  if (!schematicPublishableKey)
    throw new Error("Schematic Publishable Key is required");

  return (
    <ConvexClientProvider>
      <SchematicProvider publishableKey={schematicPublishableKey}>
        <SchematicWrapped>{children}</SchematicWrapped>
      </SchematicProvider>
    </ConvexClientProvider>
  );
}
