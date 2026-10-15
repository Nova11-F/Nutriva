import Header from "../../../components/navigation/Header";

export default function HomeDashboard({ child }) {
  return (
    <>
    <Header></Header>
    <div className="grid gap-6 md:grid-cols-3">
      <h1 className="text-2xl font-bold md:col-span-3">Halo, orang tua {child.name}</h1>
      {/* kartu status gizi, menu hari ini, dll */}
    </div>
    </>
  );
}