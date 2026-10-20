import Header from "../../../components/navigation/Header";
import Greeting from "../../../components/ui/Greeting";
import { useAuth } from "../../../hooks/useAuth"

export default function HomeDashboard({ child }) {
  const { user } = useAuth();
  return (
    <>
    <Header variant="deafult"/>
    <Greeting userName={user.name ?? "Pengguna"}/>
    <div className="grid gap-6 md:grid-cols-3">
    </div>
    </>
  );
}