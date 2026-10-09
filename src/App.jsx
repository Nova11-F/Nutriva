import { ShoppingCart, Coffee } from "lucide-react";

function App() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-md">
        
        <div className="flex items-center gap-3">
          <Coffee size={32} />

          <h1 className="text-2xl text-text font-bold">
            Coffeesui
          </h1>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-backgrounf px-5 py-3 text-white hover:bg-amber-300">
          <ShoppingCart size={20} />
          Cart
        </button>

      </div>
    </main>
  );
}

export default App;