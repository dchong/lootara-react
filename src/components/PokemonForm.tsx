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
      const {
        status,
        name,
        cardNumber,
        set,
        condition,
        location,
        purchasePrice,
        purchasedFrom,
        purchaseDate,
        price,
        soldDate,
        stripeLink,
        notes,
        images,
      } = product;

      setFormData({
        status,
        name,
        cardNumber,
        set,
        condition,
        location,
        purchasePrice,
        purchasedFrom,
        purchaseDate,
        price,
        soldDate,
        stripeLink,
        notes,
      });

      setItems((images || []).map((url) => ({ id: uuidv4(), url })));
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
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Date")
        ? value
          ? new Date(value)
          : undefined
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      images: items.map((img) => img.url),
      type: "pokemon" as const,
    };

    if (product?.id) {
      await updateDoc(doc(db, "pokemon", product.id), payload);
    } else {
      await addDoc(collection(db, "pokemon"), payload);
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

  const getDisplayValue = (key: keyof typeof formData): string | number => {
    const value = formData[key];

    if (value instanceof Date) {
      return value.toISOString().split("T")[0]; // YYYY-MM-DD
    }

    return value ?? "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            name: "status",
            type: "select",
            options: [
              "Acquired",
              "Inventory",
              "Personal",
              "Listed",
              "Sold",
              "Shipped",
              "Archived",
            ],
          },
          { name: "name", type: "text" },
          { name: "cardNumber", type: "text" },
          { name: "set", type: "text" },
          { name: "condition", type: "text" },
          { name: "location", type: "text" },
          { name: "purchasePrice", type: "number" },
          { name: "purchasedFrom", type: "text" },
          { name: "purchaseDate", type: "date" },
          { name: "price", type: "number" },
          { name: "soldDate", type: "date" },
          { name: "stripeLink", type: "text" },
        ].map((field) => {
          const key = field.name as keyof typeof formData;

          return (
            <div key={field.name}>
              <label className="block mb-1 capitalize">{field.name}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={getDisplayValue(key)}
                  onChange={handleChange}
                  className="w-full border p-2"
                >
                  <option value="">Select {field.name}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  value={getDisplayValue(key)}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              )}
            </div>
          );
        })}
      </div>

      <div>
        <label className="block mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          className="w-full border p-2"
          rows={3}
        />
      </div>

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
