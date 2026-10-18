import Header from "../../../components/navigation/Header";
import { useAuth } from "../../../hooks/useAuth";

export default function NutritionContent(){
    const { user } = useAuth();
    return(
        <>
        <Header variant="greeting" userName={user?.name ?? "pengguna"}/>
        </>
    )
}