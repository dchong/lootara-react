import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function SortableImage({ id, url, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (_jsxs("div", { ref: setNodeRef, style: style, ...attributes, className: "relative w-24 h-24", children: [_jsx("img", { src: url, className: "w-full h-full object-cover rounded cursor-move", ...listeners }), _jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onRemove(id);
                }, className: "absolute top-0 right-0 bg-red-600 text-white text-xs px-1", children: "\u2715" })] }));
}
export default function BearbrickForm() {
    const [items, setItems] = useState([]);
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
    const [editingId, setEditingId] = useState(null);
    const [bearbrickList, setBearbrickList] = useState([]);
    const sensors = useSensors(useSensor(PointerSensor));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.findIndex((img) => img.id === active.id);
            const newIndex = items.findIndex((img) => img.id === over.id);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };
    const handleImageUpload = async (e) => {
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
    const handleImageRemove = (id) => {
        setItems((prev) => prev.filter((img) => img.id !== id));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedData = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, v ?? ""]));
        const data = {
            ...trimmedData,
            images: items.map((img) => img.url),
        };
        if (editingId) {
            await updateDoc(doc(db, "bearbricks", editingId), data);
        }
        else {
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
    const handleEdit = (item) => {
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
        setItems((item.images || []).map((url) => ({ id: uuidv4(), url })));
        setEditingId(item.id);
    };
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "bearbricks", id));
        fetchItems();
    };
    useEffect(() => {
        fetchItems();
    }, []);
    return (_jsxs("div", { className: "flex gap-6", children: [_jsxs("form", { className: "bg-white p-6 rounded shadow-md w-full md:w-1/3", onSubmit: handleSubmit, children: [Object.entries(formData).map(([key, value]) => (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 capitalize", children: key }), key === "status" ? (_jsxs("select", { name: key, value: value, onChange: handleChange, className: "w-full border p-2", children: [_jsx("option", { value: "", children: "Select Status" }), [
                                        "Acquired",
                                        "Inventory",
                                        "Listed",
                                        "Pending Sale",
                                        "Sold",
                                        "Archived",
                                    ].map((status) => (_jsx("option", { children: status }, status)))] })) : key === "notes" ? (_jsx("textarea", { name: key, value: value, onChange: handleChange, className: "w-full border p-2", rows: 3 })) : (_jsx("input", { name: key, type: key.includes("price") ? "number" : "text", step: "0.01", value: value, onChange: handleChange, className: "w-full border p-2" }))] }, key))), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1", children: "Upload Images" }), _jsx("input", { type: "file", multiple: true, accept: "image/*", onChange: handleImageUpload, className: "w-full border p-2" })] }), _jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: items.map((img) => img.id), strategy: verticalListSortingStrategy, children: _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: items.map((img) => (_jsx(SortableImage, { id: img.id, url: img.url, onRemove: handleImageRemove }, img.id))) }) }) }), _jsxs("button", { className: "bg-blue-600 text-white px-4 py-2 rounded", type: "submit", children: [editingId ? "Update" : "Save", " Bearbrick"] })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Bearbrick List" }), _jsx("div", { className: "space-y-4", children: bearbrickList.map((item) => (_jsxs("div", { className: "bg-white p-4 rounded shadow relative", children: [_jsx("h3", { className: "text-lg font-bold", children: item.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Series: ", item.series, " | Size: ", item.size] }), _jsxs("p", { className: "text-sm", children: ["Price: $", item.price, " | Purchase: $", item.purchasePrice] }), _jsxs("p", { className: "text-sm", children: ["Status: ", item.status] }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: (item.images || []).map((url, index) => (_jsx("img", { src: url, className: "w-16 h-16 object-cover rounded" }, index))) }), _jsxs("div", { className: "mt-2 flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(item), className: "bg-yellow-500 text-white px-3 py-1 rounded", children: "Edit" }), _jsx("button", { onClick: () => handleDelete(item.id), className: "bg-red-600 text-white px-3 py-1 rounded", children: "Delete" })] })] }, item.id))) })] })] }));
}
