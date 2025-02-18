import Lists from "@/components/lists";
import { getAllListsWithValues } from "@/server/actions/lists";

export default async function SettingsPage() {
  const lists = await getAllListsWithValues();
  return <Lists lists={lists} />;
}
