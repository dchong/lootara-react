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
import PokemonForm from "../components/PokemonForm";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

interface BearbrickFormProps {
  product?: any;
  onSubmit?: () => void;
}

const BearbrickForm = ({ product, onSubmit }: BearbrickFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    edition: "",
    price: "",
    purchasePrice: "",
    status: "",
    notes: "",
    location: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        size: product.size || "",
        edition: product.edition || "",
        price: product.price || "",
        purchasePrice: product.purchasePrice || "",
        status: product.status || "",
        notes: product.notes || "",
        location: product.location || "",
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
      await updateDoc(doc(db, "bearbricks", product.id), formData);
    } else {
      await addDoc(collection(db, "bearbricks"), formData);
    }
    if (onSubmit) onSubmit();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      size: "",
      edition: "",
      price: "",
      purchasePrice: "",
      status: "",
      notes: "",
      location: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      {Object.entries(formData).map(([key, value]) => (
        <div className="mb-4" key={key}>
          <label className="block mb-1 capitalize">{key}</label>
          <input
            name={key}
            value={value}
            onChange={handleChange}
            type={key.includes("price") ? "number" : "text"}
            className="w-full border p-2"
          />
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {product?.id ? "Update" : "Save"} Bearbrick
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

export default BearbrickForm;
