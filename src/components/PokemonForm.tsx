// Updated PokemonForm.tsx with full Listing Info fields and Firestore support
import { useEffect, useState } from "react";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  Timestamp,
} from "firebase/firestore";
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
  const style = { transform: CSS.Transform.toString(transform), transition };

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

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border p-2"
      />
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
    listedOn: "",
    orderNumber: "",
    platformFees: undefined,
    shippingMaterialCost: undefined,
    postageCost: undefined,
    shipDate: undefined,
    tracking: "",
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
            : (product.purchaseDate as Timestamp)?.toDate?.() ?? undefined,
        price: product.price,
        soldDate:
          product.soldDate instanceof Date
            ? product.soldDate
            : (product.soldDate as Timestamp)?.toDate?.() ?? undefined,
        stripeLink: product.stripeLink ?? "",
        notes: product.notes ?? "",
        listedOn: product.listedOn ?? "",
        orderNumber: product.orderNumber ?? "",
        platformFees: product.platformFees,
        shippingMaterialCost: product.shippingMaterialCost,
        postageCost: product.postageCost,
        shipDate:
          product.shipDate instanceof Date
            ? product.shipDate
            : (product.shipDate as Timestamp)?.toDate?.() ?? undefined,
        tracking: product.tracking ?? "",
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
    const isDateField = ["purchaseDate", "soldDate", "shipDate"].includes(name);
    const parsedValue = isDateField
      ? value
        ? new Date(value)
        : undefined
      : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const getDisplayValue = (key: keyof typeof formData): string | number => {
    const value = formData[key];
    if (value instanceof Date) return value.toISOString().split("T")[0];
    if (value instanceof Timestamp)
      return value.toDate().toISOString().split("T")[0];
    return value ?? "";
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
      listedOn: "",
      orderNumber: "",
      platformFees: undefined,
      shippingMaterialCost: undefined,
      postageCost: undefined,
      shipDate: undefined,
      tracking: "",
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
      <div>
        <h2 className="text-lg font-semibold mb-2">General Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Status"
            name="status"
            value={getDisplayValue("status")}
            onChange={handleChange}
          />
          <InputField
            label="Bin"
            name="location"
            value={getDisplayValue("location")}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Card Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Name"
            name="name"
            value={getDisplayValue("name")}
            onChange={handleChange}
          />
          <InputField
            label="Card Number"
            name="cardNumber"
            value={getDisplayValue("cardNumber")}
            onChange={handleChange}
          />
          <InputField
            label="Set"
            name="set"
            value={getDisplayValue("set")}
            onChange={handleChange}
          />
          <InputField
            label="Condition"
            name="condition"
            value={getDisplayValue("condition")}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Purchase Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={getDisplayValue("purchasePrice")}
            onChange={handleChange}
          />
          <InputField
            label="Purchased From"
            name="purchasedFrom"
            value={getDisplayValue("purchasedFrom")}
            onChange={handleChange}
          />
          <InputField
            label="Purchase Date"
            name="purchaseDate"
            type="date"
            value={getDisplayValue("purchaseDate")}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Listing Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Listing Price"
            name="price"
            type="number"
            value={getDisplayValue("price")}
            onChange={handleChange}
          />
          <InputField
            label="Listed On"
            name="listedOn"
            value={getDisplayValue("listedOn")}
            onChange={handleChange}
          />
          <InputField
            label="Stripe Link"
            name="stripeLink"
            value={getDisplayValue("stripeLink")}
            onChange={handleChange}
          />
          <InputField
            label="Sold Date"
            name="soldDate"
            type="date"
            value={getDisplayValue("soldDate")}
            onChange={handleChange}
          />
          <InputField
            label="Order Number"
            name="orderNumber"
            value={getDisplayValue("orderNumber")}
            onChange={handleChange}
          />
          <InputField
            label="Platform Fees"
            name="platformFees"
            type="number"
            value={getDisplayValue("platformFees")}
            onChange={handleChange}
          />
          <InputField
            label="Shipping Material Cost"
            name="shippingMaterialCost"
            type="number"
            value={getDisplayValue("shippingMaterialCost")}
            onChange={handleChange}
          />
          <InputField
            label="Postage Cost"
            name="postageCost"
            type="number"
            value={getDisplayValue("postageCost")}
            onChange={handleChange}
          />
          <InputField
            label="Ship Date"
            name="shipDate"
            type="date"
            value={getDisplayValue("shipDate")}
            onChange={handleChange}
          />
          <InputField
            label="Tracking"
            name="tracking"
            value={getDisplayValue("tracking")}
            onChange={handleChange}
          />
        </div>
      </div>

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
