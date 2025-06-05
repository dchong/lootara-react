import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import { db } from "@/firebase";
import PokemonForm from "../components/PokemonForm";
import BearbrickForm from "../components/BearbrickForm";
import ProductCard from "../components/ProductCard";
import PokemonCard from "../components/PokemonCard";
import BearbrickCard from "../components/BearbrickCard";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

const Admin = () => {
  useFirebaseAuth();
  const [activeTab, setActiveTab] = useState<"pokemon" | "bearbricks">(
    "pokemon"
  );
  const [products, setProducts] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    const col = collection(db, activeTab);
    const snap = await getDocs(query(col));
    setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, activeTab, id));
    fetchItems();
  };

  const handleEdit = (item: any) => {
    setEditingProduct(item);
  };

  const filtered = products.filter((item) => {
    const matchSearch = item.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleFormSubmit = () => {
    fetchItems();
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex space-x-4">
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

      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        <div className="w-full lg:w-1/2">
          {activeTab === "pokemon" ? (
            <PokemonForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              additionalFields={["soldDate", "purchaseDate", "cardNumber"]}
            />
          ) : (
            <BearbrickForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
            />
          )}
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded w-full sm:w-1/2"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded w-full sm:w-1/4"
            >
              <option value="all">All Statuses</option>
              <option value="Acquired">Acquired</option>
              <option value="Inventory">Inventory</option>
              <option value="Listed">Listed</option>
              <option value="Pending Sale">Pending Sale</option>
              <option value="Sold">Sold</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) =>
              activeTab === "pokemon" ? (
                <PokemonCard
                  key={item.id}
                  data={item}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ) : (
                <BearbrickCard
                  key={item.id}
                  data={item}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
