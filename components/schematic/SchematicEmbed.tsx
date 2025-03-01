"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const SchematicEmbedComponent = dynamic(
  () =>
    import("@schematichq/schematic-components").then(
      (mod) => mod.SchematicEmbed
    ),
  {
    ssr: false,
    loading: () => <p>Loading component...</p>,
  }
);

const SchematicEmbed = ({
  accessToken,
  componentId,
}: {
  accessToken: string;
  componentId: string;
}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchematicEmbedComponent accessToken={accessToken} id={componentId} />
    </Suspense>
  );
};

export default SchematicEmbed;
