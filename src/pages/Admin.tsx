import { useState } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import PokemonForm from "../components/PokemonForm";
import BearbrickForm from "../components/BearbrickForm";
import ProductCard from "../components/ProductCard";

const Admin = () => {
  useFirebaseAuth();
  const [activeTab, setActiveTab] = useState<"pokemon" | "bearbricks">(
    "pokemon"
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveTab("pokemon")}
          className={`px-4 py-2 rounded ${
            activeTab === "pokemon" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Pokémon
        </button>
        <button
          onClick={() => setActiveTab("bearbricks")}
          className={`px-4 py-2 rounded ${
            activeTab === "bearbricks"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
        >
          Bearbricks
        </button>
      </div>

      {activeTab === "pokemon" ? <PokemonForm /> : <BearbrickForm />}
      {/* Add filter + product list section here next */}
    </div>
  );
};

export default Admin;
