import { useChild } from "../../hooks/useChild";
import Spinner from "../../components/ui/Spinner";
import NoChildState from "../../components/ui/NoChildState";
import AssistantChat from "./components/AssistantChat";

export default function AssistantPage() {
  const { child, loading } = useChild();

  if (loading) return <Spinner center label="Memuat data anak..." />;
  if (!child) return <NoChildState feature="Asisten AI" />;

  return <AssistantChat key={child.id} child={child} />;
}