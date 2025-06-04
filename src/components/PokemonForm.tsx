import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

interface PokemonFormProps {
  product?: any;
  onSubmit?: () => void;
}

const PokemonForm = ({ product, onSubmit }: PokemonFormProps) => {
  const [formData, setFormData] = useState({
    status: "",
    name: "",
    cardNumber: "",
    set: "",
    condition: "",
    purchasePrice: "",
    purchasedFrom: "",
    purchaseDate: "",
    price: "",
    soldDate: "",
    location: "",
    stripeLink: "",
    notes: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        status: product.status || "",
        name: product.name || "",
        cardNumber: product.cardNumber || "",
        set: product.set || "",
        condition: product.condition || "",
        purchasePrice: product.purchasePrice || "",
        purchasedFrom: product.purchasedFrom || "",
        purchaseDate: product.purchaseDate || "",
        price: product.price || "",
        soldDate: product.soldDate || "",
        location: product.location || "",
        stripeLink: product.stripeLink || "",
        notes: product.notes || "",
      });
    } else {
      resetForm();
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product?.id) {
      await updateDoc(doc(db, "pokemon", product.id), formData);
    } else {
      await addDoc(collection(db, "pokemon"), formData);
    }
    if (onSubmit) onSubmit();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      status: "",
      name: "",
      cardNumber: "",
      set: "",
      condition: "",
      purchasePrice: "",
      purchasedFrom: "",
      purchaseDate: "",
      price: "",
      soldDate: "",
      location: "",
      stripeLink: "",
      notes: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      {Object.entries(formData).map(([key, value]) => (
        <div className="mb-4" key={key}>
          <label className="block mb-1 capitalize">{key}</label>
          {key === "condition" ? (
            <select
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="">Select Condition</option>
              <option value="Near Mint">Near Mint</option>
              <option value="Lightly Played">Lightly Played</option>
              <option value="Moderately Played">Moderately Played</option>
              <option value="Heavily Played">Heavily Played</option>
              <option value="Damaged">Damaged</option>
            </select>
          ) : (
            <input
              name={key}
              value={value}
              onChange={handleChange}
              type={
                key.includes("Date")
                  ? "date"
                  : key.includes("price")
                  ? "number"
                  : "text"
              }
              className="w-full border p-2"
            />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {product?.id ? "Update" : "Save"} Pokemon
        </button>
        {product?.id && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PokemonForm;
