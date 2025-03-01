"use client";

import { SchematicEmbed as SchematicEmbedComponent } from "@schematichq/schematic-components";

const SchematicEmbed = ({
  accessToken,
  componentId,
}: {
  accessToken: string;
  componentId: string;
}) => {
  // const token = " ... ";
  // const componentId = "cmpn_CNnhzFbickp";

  return (
    <div>
      <SchematicEmbedComponent accessToken={accessToken} id={componentId} />
    </div>
  );
};

export default SchematicEmbed;
