import { useState, useEffect } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import { db } from "@/firebase";
import PokemonForm from "../components/PokemonForm";
import BearbrickForm from "../components/BearbrickForm";
import ProductCard from "../components/ProductCard";

const Admin = () => {
  useFirebaseAuth();
  const [activeTab, setActiveTab] = useState<"pokemon" | "bearbricks">(
    "pokemon"
  );
  const [products, setProducts] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    console.log("Edit", item);
    // You can optionally pass editing data to the form
  };

  const filtered = products.filter((item) => {
    const matchSearch = item.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="container mx-auto p-6">
      {/* Tab Switcher */}
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

      {/* Form Component */}
      <div className="mb-8">
        {activeTab === "pokemon" ? <PokemonForm /> : <BearbrickForm />}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
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

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <ProductCard
            key={item.id}
            data={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Admin;
