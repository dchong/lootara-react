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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PokemonFormProps {
  product?: any;
  onSubmit?: () => void;
}

function SortableImage({ id, url, onRemove }: any) {
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
  const [items, setItems] = useState<any[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));
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
      setItems(
        (product.images || []).map((url: string) => ({ id: uuidv4(), url }))
      );
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
      await updateDoc(doc(db, "pokemon", product.id), {
        ...formData,
        images: items.map((img) => img.url),
      });
    } else {
      await addDoc(collection(db, "pokemon"), {
        ...formData,
        images: items.map((img) => img.url),
      });
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
    setItems([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold mb-2">General Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 capitalize">status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="">Select Status</option>
              <option value="Acquired">Acquired</option>
              <option value="Inventory">Inventory</option>
              <option value="Personal">Personal Collection</option>
              <option value="Listed">Listed</option>
              <option value="Sold">Sold</option>
              <option value="Shipped">Shipped</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Card Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 capitalize">name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1 capitalize">card number</label>
            <input
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1 capitalize">set</label>
            <input
              name="set"
              value={formData.set}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
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
          <div>
            <label className="block mb-1 capitalize">location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Purchase Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 capitalize">purchase price</label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1 capitalize">purchased from</label>
            <input
              name="purchasedFrom"
              value={formData.purchasedFrom}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1 capitalize">purchase date</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Listing Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 capitalize">listing price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1 capitalize">sold date</label>
            <input
              type="date"
              name="soldDate"
              value={formData.soldDate}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block mb-1 capitalize">stripe link</label>
            <input
              name="stripeLink"
              value={formData.stripeLink}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Notes</h2>
        <div className="mb-4">
          <label className="block mb-1 capitalize">notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border p-2"
            rows={3}
          />
        </div>
      </div>

      <div>
        <label className="block mb-1">Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={async (e) => {
            const files = e.target.files;
            const uploaded: { id: string; url: string }[] = [];
            for (const file of files) {
              const imageId = uuidv4();
              const imageRef = ref(storage, `pokemon/${imageId}`);
              await uploadBytes(imageRef, file);
              const url = await getDownloadURL(imageRef);
              uploaded.push({ id: imageId, url });
            }
            setItems((prev) => [...prev, ...uploaded]);
          }}
          className="w-full border p-2 mb-4"
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (active.id !== over?.id) {
              const oldIndex = items.findIndex((img) => img.id === active.id);
              const newIndex = items.findIndex((img) => img.id === over?.id);
              setItems(arrayMove(items, oldIndex, newIndex));
            }
          }}
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
                    setItems((prev) => prev.filter((img) => img.id !== id))
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
