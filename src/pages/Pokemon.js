import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import PokemonCard from "../components/PokemonCard";
import PokemonModal from "../components/Modal";
const CARDS_PER_PAGE = 9;
export default function PokemonStorefront() {
    const [allCards, setAllCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalImages, setModalImages] = useState([]);
    const [modalStartIndex, setModalStartIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const observer = useRef(null);
    const filteredCards = allCards.filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.set && card.set.toLowerCase().includes(searchTerm.toLowerCase())));
    const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
    const paginatedCards = filteredCards.slice(0, currentPage * CARDS_PER_PAGE);
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
    const fetchCards = async () => {
        const snap = await getDocs(collection(db, "pokemon"));
        const listedCards = snap.docs
            .map((doc) => doc.data())
            .filter((card) => card.status === "Listed");
        setAllCards(listedCards);
    };
    useEffect(() => {
        fetchCards();
    }, []);
    const handleCardImageClick = (images, index) => {
        setModalImages(images);
        setModalStartIndex(index);
        setModalVisible(true);
    };
    return (_jsxs("div", { className: "bg-gray-100 min-h-screen", children: [_jsxs("div", { className: "container mx-auto px-4 py-6", children: [_jsxs("div", { className: "flex flex-wrap gap-4 items-center mb-6", children: [_jsx("input", { type: "text", placeholder: "Search cards by name or set...", value: searchTerm, onChange: (e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }, className: "flex-1 p-3 border rounded shadow-sm" }), _jsx("button", { onClick: () => {
                                    setSearchTerm("");
                                    setCurrentPage(1);
                                }, className: "bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition", children: "Clear" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6", children: paginatedCards.map((card, idx) => {
                            const isLast = idx === paginatedCards.length - 1;
                            return (_jsx("div", { ref: isLast ? lastCardRef : null, children: _jsx(PokemonCard, { card: card, onImageClick: (index) => handleCardImageClick(card.images || [], index) }) }, idx));
                        }) })] }), modalVisible && (_jsx(PokemonModal, { images: modalImages, startIndex: modalStartIndex, onClose: () => setModalVisible(false) }))] }));
}
