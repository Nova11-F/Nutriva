import Header from "../../../components/navigation/Header";
import { useAuth } from "../../../hooks/useAuth";
import Greeting from "../../../components/ui/Greeting";

export default function GrowthContent() {
  const { user } = useAuth();
  return (
    <>
      <Header variant="pertumbuhan" />
      <Greeting userName={user.name ?? "Pengguna"}/>
    </>
  );
}
