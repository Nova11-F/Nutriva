import Header from "../../../components/navigation/Header";
import Greeting from "../../../components/ui/Greeting";
import { useAuth } from "../../../hooks/useAuth";

export default function NutritionContent(){
    const { user } = useAuth();
    return(
        <>
        <Header variant="nutrisi"/>
        <Greeting userName={user.name ?? "Pengguna"}/>
        </>
    )
}