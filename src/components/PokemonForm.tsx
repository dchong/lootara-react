import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { uploadImages } from "../utils/uploadImages";
import { PokemonProduct } from "../types";

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
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

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

      const docData: PokemonProduct = {
        ...product,
        images: imageUrls,
      };

      await addDoc(collection(db, "pokemon"), docData);

      setStatusMessage("Saved successfully!");
      setProduct(defaultProduct);
      setImageFiles(null);
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to save. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md w-full max-w-lg"
    >
      <h2 className="text-xl font-bold mb-4">Add Pokémon Product</h2>

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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Pokémon
      </button>

      {statusMessage && (
        <div className="mt-4 text-sm text-green-600">{statusMessage}</div>
      )}
    </form>
  );
};

export default PokemonForm;
