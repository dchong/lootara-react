import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
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

export default function BearbrickForm() {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    series: "",
    size: "",
    price: "",
    purchasePrice: "",
    purchasedFrom: "",
    status: "",
    stripeLink: "",
    notes: "",
    location: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bearbrickList, setBearbrickList] = useState<any[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((img) => img.id === active.id);
      const newIndex = items.findIndex((img) => img.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    const uploaded = [];
    for (const file of files) {
      const imageId = uuidv4();
      const imageRef = ref(storage, `bearbricks/${imageId}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      uploaded.push({ id: imageId, url });
    }
    setItems((prev) => [...prev, ...uploaded]);
  };

  const handleImageRemove = (id: string) => {
    setItems((prev) => prev.filter((img) => img.id !== id));
  };

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
    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, v ?? ""])
    );

    const data = {
      ...trimmedData,
      images: items.map((img) => img.url),
    };

    if (editingId) {
      await updateDoc(doc(db, "bearbricks", editingId), data);
    } else {
      await addDoc(collection(db, "bearbricks"), data);
    }

    await fetchItems();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      series: "",
      size: "",
      price: "",
      purchasePrice: "",
      purchasedFrom: "",
      status: "",
      stripeLink: "",
      notes: "",
      location: "",
    });
    setItems([]);
    setEditingId(null);
  };

  const fetchItems = async () => {
    const snap = await getDocs(collection(db, "bearbricks"));
    setBearbrickList(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name || "",
      series: item.series || "",
      size: item.size || "",
      price: item.price || "",
      purchasePrice: item.purchasePrice || "",
      purchasedFrom: item.purchasedFrom || "",
      status: item.status || "",
      stripeLink: item.stripeLink || "",
      notes: item.notes || "",
      location: item.location || "",
    });
    setItems((item.images || []).map((url: string) => ({ id: uuidv4(), url })));
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "bearbricks", id));
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="flex gap-6">
      <form
        className="bg-white p-6 rounded shadow-md w-full md:w-1/3"
        onSubmit={handleSubmit}
      >
        {Object.entries(formData).map(([key, value]) => (
          <div className="mb-4" key={key}>
            <label className="block mb-1 capitalize">{key}</label>
            {key === "status" ? (
              <select
                name={key}
                value={value}
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
                ].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            ) : key === "notes" ? (
              <textarea
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full border p-2"
                rows={3}
              />
            ) : (
              <input
                name={key}
                type={key.includes("price") ? "number" : "text"}
                step="0.01"
                value={value}
                onChange={handleChange}
                className="w-full border p-2"
              />
            )}
          </div>
        ))}

        <div className="mb-4">
          <label className="block mb-1">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2"
          />
        </div>

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
                  onRemove={handleImageRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          {editingId ? "Update" : "Save"} Bearbrick
        </button>
      </form>

      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Bearbrick List</h2>
        <div className="space-y-4">
          {bearbrickList.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow relative">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600">
                Series: {item.series} | Size: {item.size}
              </p>
              <p className="text-sm">
                Price: ${item.price} | Purchase: ${item.purchasePrice}
              </p>
              <p className="text-sm">Status: {item.status}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(item.images || []).map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
