import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import BearbrickCard from "../components/BearbrickCard";
import BearbrickModal from "../components/Modal";
const CARDS_PER_PAGE = 9;
export default function BearbrickStorefront() {
    const [allBearbricks, setAllBearbricks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalImages, setModalImages] = useState([]);
    const [modalStartIndex, setModalStartIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const observer = useRef(null);
    const filteredBearbricks = allBearbricks.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.set && item.set.toLowerCase().includes(searchTerm.toLowerCase())));
    const totalPages = Math.ceil(filteredBearbricks.length / CARDS_PER_PAGE);
    const paginatedBearbricks = filteredBearbricks.slice(0, currentPage * CARDS_PER_PAGE);
    const lastCardRef = useCallback((node) => {
        if (observer.current)
            observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && currentPage < totalPages) {
                setCurrentPage((prev) => prev + 1);
            }
        });
        if (node)
            observer.current.observe(node);
    }, [currentPage, totalPages]);
    const fetchBearbricks = async () => {
        const snap = await getDocs(collection(db, "bearbricks"));
        const listed = snap.docs
            .map((doc) => doc.data())
            .filter((item) => item.status === "Listed");
        setAllBearbricks(listed);
    };
    useEffect(() => {
        fetchBearbricks();
    }, []);
    const handleCardImageClick = (images, index) => {
        setModalImages(images);
        setModalStartIndex(index);
        setModalVisible(true);
    };
    return (_jsxs("div", { className: "bg-gray-100 min-h-screen", children: [_jsxs("div", { className: "container mx-auto px-4 py-6", children: [_jsxs("div", { className: "flex flex-wrap gap-4 items-center mb-6", children: [_jsx("input", { type: "text", placeholder: "Search by name or set...", value: searchTerm, onChange: (e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }, className: "flex-1 p-3 border rounded shadow-sm" }), _jsx("button", { onClick: () => {
                                    setSearchTerm("");
                                    setCurrentPage(1);
                                }, className: "bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition", children: "Clear" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6", children: paginatedBearbricks.map((item, idx) => {
                            const isLast = idx === paginatedBearbricks.length - 1;
                            return (_jsxs("div", { ref: isLast ? lastCardRef : null, className: "flex flex-col", children: [_jsx(BearbrickCard, { card: item, onImageClick: (index) => handleCardImageClick(item.images || [], index) }), _jsx("p", { className: "text-sm text-gray-600 italic mt-1", children: item.set }), _jsx("p", { className: "text-sm text-gray-600 italic", children: item.condition })] }, idx));
                        }) })] }), modalVisible && (_jsx(BearbrickModal, { images: modalImages, startIndex: modalStartIndex, onClose: () => setModalVisible(false) }))] }));
}
