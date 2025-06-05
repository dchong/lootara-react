import { useEffect, useState, useRef, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import PokemonStorefrontCard from "../components/PokemonStorefrontCard";
import PokemonModal from "../components/Modal";

const CARDS_PER_PAGE = 9;

export default function PokemonStorefront() {
  const [allCards, setAllCards] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalStartIndex, setModalStartIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const observer = useRef<IntersectionObserver | null>(null);

  const filteredCards = allCards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.set && card.set.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  const paginatedCards = filteredCards.slice(0, currentPage * CARDS_PER_PAGE);

  const lastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [currentPage, totalPages]
  );

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

  const handleCardImageClick = (images: string[], index: number) => {
    setModalImages(images);
    setModalStartIndex(index);
    setModalVisible(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Search cards by name or set..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 p-3 border rounded shadow-sm"
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedCards.map((card, idx) => {
            const isLast = idx === paginatedCards.length - 1;
            return (
              <div ref={isLast ? lastCardRef : null} key={idx}>
                <PokemonStorefrontCard
                  card={card}
                  onImageClick={(index) =>
                    handleCardImageClick(card.images || [], index)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {modalVisible && (
        <PokemonModal
          images={modalImages}
          startIndex={modalStartIndex}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
}
