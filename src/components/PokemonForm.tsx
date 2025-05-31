import { useEffect, useState } from "react";
import { db, storage } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PokemonProduct } from "@/types";
import ProductCard from "./ProductCard";

const initialProduct: PokemonProduct = {
  name: "",
  set: "",
  condition: "",
  price: 0,
  purchasePrice: 0,
  purchasedFrom: "",
  status: "",
  notes: "",
  location: "",
  stripeLink: "",
  images: [],
};

export default function PokemonForm() {
  const [product, setProduct] = useState<PokemonProduct>(initialProduct);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [products, setProducts] = useState<(PokemonProduct & { id: string })[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "pokemon"));
    const data = snapshot.docs.map(
      (doc) =>
        ({ id: doc.id, ...doc.data() } as PokemonProduct & { id: string })
    );
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageUrls: string[] = [];

    if (imageFiles && imageFiles.length) {
      const uploadPromises = Array.from(imageFiles).map(async (file) => {
        const fileRef = ref(storage, `pokemon/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    const mergedImages = [...(product.images || []), ...imageUrls];
    const data: PokemonProduct = { ...product, images: mergedImages };

    if ((data as any).id) {
      const id = (data as any).id;
      delete (data as any).id;
      await updateDoc(doc(db, "pokemon", id), data);
    } else {
      await addDoc(collection(db, "pokemon"), data);
    }

    setProduct(initialProduct);
    setImageFiles(null);
    fetchProducts();
  };

  const handleEdit = (item: PokemonProduct & { id: string }) => {
    setProduct(item);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "pokemon", id));
    fetchProducts();
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full"
        >
          <input
            className="mb-4 w-full border p-2"
            placeholder="Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <input
            className="mb-4 w-full border p-2"
            placeholder="Set"
            value={product.set}
            onChange={(e) => setProduct({ ...product, set: e.target.value })}
          />
          <input
            className="mb-4 w-full border p-2"
            placeholder="Condition"
            value={product.condition}
            onChange={(e) =>
              setProduct({ ...product, condition: e.target.value })
            }
          />
          <input
            className="mb-4 w-full border p-2"
            placeholder="Price"
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: parseFloat(e.target.value) })
            }
            required
          />
          <input
            className="mb-4 w-full border p-2"
            placeholder="Purchase Price"
            type="number"
            value={product.purchasePrice}
            onChange={(e) =>
              setProduct({
                ...product,
                purchasePrice: parseFloat(e.target.value),
              })
            }
          />
          <input
            className="mb-4 w-full border p-2"
            placeholder="Purchased From"
            value={product.purchasedFrom}
            onChange={(e) =>
              setProduct({ ...product, purchasedFrom: e.target.value })
            }
          />
          <select
            className="mb-4 w-full border p-2"
            value={product.status}
            onChange={(e) => setProduct({ ...product, status: e.target.value })}
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
          <textarea
            className="mb-4 w-full border p-2"
            placeholder="Notes"
            value={product.notes}
            onChange={(e) => setProduct({ ...product, notes: e.target.value })}
          />
          <input
            className="mb-4 w-full border p-2"
            placeholder="Storage Bin"
            value={product.location}
            onChange={(e) =>
              setProduct({ ...product, location: e.target.value })
            }
          />
          <input
            className="mb-4 w-full border p-2"
            placeholder="Stripe Checkout Link"
            value={product.stripeLink}
            onChange={(e) =>
              setProduct({ ...product, stripeLink: e.target.value })
            }
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImageFiles(e.target.files)}
            className="mb-4 w-full border p-2"
          />

          {product.images && product.images.length > 0 && (
            <div className="mb-4">
              <label className="block mb-1">Existing Images</label>
              <div className="flex flex-wrap gap-2">
                {product.images.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={url}
                      className="object-cover w-full h-full rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProduct((prev) => ({
                          ...prev,
                          images: prev.images!.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            type="submit"
          >
            Save Pokémon
          </button>
        </form>
      </div>

      <div className="w-full md:flex-1">
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
            {["Inventory", "Listed", "Pending Sale", "Sold", "Archived"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </div>
        <div className="grid gap-4">
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
    </div>
  );
}
