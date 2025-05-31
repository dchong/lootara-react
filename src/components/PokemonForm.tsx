import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { uploadImages } from "../utils/uploadImages";
import { PokemonProduct } from "../types";
import ProductCard from "./ProductCard";

const defaultProduct: PokemonProduct = {
  name: "",
  set: "",
  condition: "",
  price: 0,
  purchasePrice: undefined,
  purchasedFrom: "",
  status: "",
  notes: "",
  location: "",
  stripeLink: "",
  images: [],
};

const PokemonForm = () => {
  const [product, setProduct] = useState<PokemonProduct>(defaultProduct);
  const [products, setProducts] = useState<PokemonProduct[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadProducts = async () => {
    const snapshot = await getDocs(collection(db, "pokemon"));
    const all = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PokemonProduct[];

    const filtered = all.filter((item) => {
      const matchName = item.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? item.status === statusFilter : true;
      return matchName && matchStatus;
    });

    setProducts(filtered);
  };

  useEffect(() => {
    loadProducts();
  }, [search, statusFilter]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "purchasePrice"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrls: string[] = [];
      if (imageFiles && imageFiles.length) {
        imageUrls = await uploadImages(imageFiles, "pokemon");
      }

      const data: PokemonProduct = {
        ...product,
        images: imageUrls.length ? imageUrls : product.images,
      };

      if (editingId) {
        await updateDoc(doc(db, "pokemon", editingId), data);
      } else {
        await addDoc(collection(db, "pokemon"), data);
      }

      setStatusMessage(
        editingId ? "Updated successfully!" : "Saved successfully!"
      );
      setProduct(defaultProduct);
      setImageFiles(null);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error saving product.");
    }
  };

  const handleEdit = (item: PokemonProduct) => {
    setProduct(item);
    setEditingId(item.id!);
    setImageFiles(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "pokemon", id));
      loadProducts();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: Form */}
      <div className="w-full md:w-1/3">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full"
        >
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Pokémon" : "Add Pokémon"}
          </h2>

          {[
            { label: "Name", name: "name", type: "text", required: true },
            { label: "Set", name: "set", type: "text" },
            { label: "Condition", name: "condition", type: "text" },
            {
              label: "Price",
              name: "price",
              type: "number",
              step: "0.01",
              required: true,
            },
            {
              label: "Purchase Price",
              name: "purchasePrice",
              type: "number",
              step: "0.01",
            },
            { label: "Purchased From", name: "purchasedFrom", type: "text" },
            { label: "Storage Bin", name: "location", type: "text" },
            { label: "Stripe Checkout Link", name: "stripeLink", type: "url" },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block mb-1">{field.label}</label>
              <input
                {...field}
                name={field.name}
                value={product[field.name as keyof PokemonProduct] ?? ""}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={product.status}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="">Select Status</option>
              {[
                "Acquired",
                "Inventory",
                "Listed",
                "Pending Sale",
                "Sold",
                "Archived",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Notes</label>
            <textarea
              name="notes"
              value={product.notes}
              onChange={handleChange}
              className="w-full border p-2"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(e.target.files)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update Pokémon" : "Save Pokémon"}
            </button>

            {editingId && (
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditingId(null);
                  setProduct(defaultProduct);
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {statusMessage && (
            <div className="mt-4 text-sm text-green-600">{statusMessage}</div>
          )}
        </form>
      </div>

      {/* Right: Filter + List */}
      <div className="w-full md:flex-1">
        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            className="border p-2 w-full sm:w-auto flex-grow"
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {[
              "Acquired",
              "Inventory",
              "Listed",
              "Pending Sale",
              "Sold",
              "Archived",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Product List */}
        <div className="grid gap-4">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              data={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id!)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonForm;
