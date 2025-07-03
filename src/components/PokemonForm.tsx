// PokemonForm.tsx
import { useEffect, useState } from "react";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db, storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PokemonProduct } from "../types";

interface PokemonFormProps {
  product?: PokemonProduct;
  onSubmit?: () => void;
}

interface ImageItem {
  id: string;
  url: string;
}

function SortableImage({
  id,
  url,
  onRemove,
}: {
  id: string;
  url: string;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative w-24 h-24"
    >
      <img
        src={url}
        loading="lazy"
        className="w-full h-full object-cover rounded cursor-move"
        {...listeners}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1"
      >
        ✕
      </button>
    </div>
  );
}

const PokemonForm = ({ product, onSubmit }: PokemonFormProps) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const [items, setItems] = useState<ImageItem[]>([]);

  const [formData, setFormData] = useState<
    Omit<PokemonProduct, "id" | "images" | "type">
  >({
    status: "",
    name: "",
    cardNumber: "",
    set: "",
    condition: "",
    location: "",
    purchasePrice: undefined,
    purchasedFrom: "",
    purchaseDate: undefined,
    price: undefined,
    soldDate: undefined,
    stripeLink: "",
    notes: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        status: product.status,
        name: product.name,
        cardNumber: product.cardNumber,
        set: product.set,
        condition: product.condition ?? "",
        location: product.location ?? "",
        purchasePrice: product.purchasePrice,
        purchasedFrom: product.purchasedFrom ?? "",
       purchaseDate:
  product.purchaseDate instanceof Date
    ? product.purchaseDate
    : product.purchaseDate?.toDate?.() ?? undefined,
        price: product.price,
        soldDate: product.soldDate instanceof Date
    ? product.soldDate
    : product.soldDate?.toDate?.() ?? undefined,
        stripeLink: product.stripeLink ?? "",
        notes: product.notes ?? "",
      });
      setItems((product.images || []).map((url) => ({ id: uuidv4(), url })));
    } else {
      resetForm();
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const isDateField = name === "purchaseDate" || name === "soldDate";
    const parsedValue = isDateField
      ? value
        ? new Date(value)
        : undefined
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const getDisplayValue = (key: keyof typeof formData): string | number => {
    const value = formData[key];
    if (value instanceof Date) {
      return value.toISOString().split("T")[0];
    }
    return value ?? "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedFormData = {
      ...formData,
      price: formData.price ?? 0,
      purchasePrice: formData.purchasePrice ?? 0,
      soldDate: formData.soldDate ?? null,
      images: items.map((img) => img.url),
      type: "pokemon" as const,
    };

    if (product?.id) {
      await updateDoc(doc(db, "pokemon", product.id), cleanedFormData);
    } else {
      await addDoc(collection(db, "pokemon"), cleanedFormData);
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
      location: "",
      purchasePrice: undefined,
      purchasedFrom: "",
      purchaseDate: undefined,
      price: undefined,
      soldDate: undefined,
      stripeLink: "",
      notes: "",
    });
    setItems([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const uploaded: ImageItem[] = [];
    for (const file of Array.from(files)) {
      const imageId = uuidv4();
      const imageRef = ref(storage, `pokemon/${imageId}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      uploaded.push({ id: imageId, url });
    }
    setItems((prev) => [...prev, ...uploaded]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((img) => img.id === active.id);
      const newIndex = items.findIndex((img) => img.id === over?.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-6"
    >
      {/* General Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">General Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={getDisplayValue("status")}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="">Select Status</option>
              {[
                "Acquired",
                "Inventory",
                "Personal",
                "Listed",
                "Sold",
                "Shipped",
                "Archived",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Card Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["name", "cardNumber", "set"] as const).map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field}</label>
              <input
                name={field}
                value={getDisplayValue(field)}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>
          ))}
          <div>
            <label className="block mb-1 capitalize">condition</label>
            <input
              list="conditionOptions"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full border p-2"
            />
            <datalist id="conditionOptions">
              <option value="Near Mint" />
              <option value="Lightly Played" />
              <option value="Moderately Played" />
              <option value="Heavily Played" />
              <option value="Damaged" />
            </datalist>
          </div>
        </div>
      </div>

      {/* Purchase Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Purchase Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Purchase Price</label>
            <input
              type="number"
              name="purchasePrice"
              value={getDisplayValue("purchasePrice")}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Purchased From</label>
            <input
              name="purchasedFrom"
              value={getDisplayValue("purchasedFrom")}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={getDisplayValue("purchaseDate")}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>
      </div>

      {/* Listing Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Listing Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Listing Price</label>
            <input
              type="number"
              name="price"
              value={getDisplayValue("price")}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Sold Date</label>
            <input
              type="date"
              name="soldDate"
              value={getDisplayValue("soldDate")}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Stripe Link</label>
            <input
              name="stripeLink"
              value={getDisplayValue("stripeLink")}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-1">Notes</label>
        <textarea
          name="notes"
          value={getDisplayValue("notes")}
          onChange={handleChange}
          className="w-full border p-2"
          rows={3}
        />
      </div>

      {/* Images */}
      <div>
        <label className="block mb-1">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border p-2 mb-4"
        />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((img) => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {items.map((img) => (
                <SortableImage
                  key={img.id}
                  id={img.id}
                  url={img.url}
                  onRemove={(id) =>
                    setItems((prev) => prev.filter((i) => i.id !== id))
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {product?.id ? "Update" : "Save"} Pokémon
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
