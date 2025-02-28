import { getTemporaryAccessTokens } from "@/actions/getTemporaryAccessTokens";
import SchematicEmbed from "./SchematicEmbed";

async function SchematicComponent({ componentId }: { componentId: string }) {
  if (!componentId) return null;

  const accessToken = await getTemporaryAccessTokens();
  if (!accessToken) return null;

  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
}

export default SchematicComponent;
