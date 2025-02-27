"use client";

import { useUser } from "@clerk/nextjs";
import { useSchematicEvents } from "@schematichq/schematic-react";
import React, { useEffect } from "react";

const SchematicWrapped = ({ children }: { children: React.ReactNode }) => {
  const { identify } = useSchematicEvents();
  const { user } = useUser();

  useEffect(() => {
    const userName =
      user?.username ||
      user?.fullName ||
      user?.emailAddresses[0]?.emailAddress ||
      user?.id ||
      "Guest";

    if (user?.id) {
      identify({
        company: {
          keys: {
            id: user.id,
          },
          name: userName,
        },

        // User Level Setup
        keys: {
          id: user.id,
        },
        name: userName,
      });
    }
  }, [user, identify]);
  return <>{children}</>;
};

export default SchematicWrapped;
