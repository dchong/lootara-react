// src/components/DetailModal.tsx
import { PokemonProduct, BearbrickProduct } from "@/types";

interface DetailModalProps {
  item: PokemonProduct | BearbrickProduct;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded shadow-xl max-w-lg w-full p-6 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>

        {item.type === "pokemon" && (
          <>
            <p>
              <strong>Set:</strong> {item.set || "—"}
            </p>
            <p>
              <strong>Condition:</strong> {item.condition || "—"}
            </p>
          </>
        )}

        {item.type === "bearbrick" && (
          <>
            <p>
              <strong>Series:</strong> {item.series || "—"}
            </p>
            <p>
              <strong>Size:</strong> {item.size || "—"}
            </p>
          </>
        )}

        <p>
          <strong>Status:</strong> {item.status}
        </p>
        <p>
          <strong>Price:</strong> ${item.price || 0}
        </p>
        <p>
          <strong>Purchase Price:</strong> ${item.purchasePrice || 0}
        </p>
        <p>
          <strong>Purchased From:</strong> {item.purchasedFrom || "—"}
        </p>
        <p>
          <strong>Location:</strong> {item.location || "—"}
        </p>
        <p>
          <strong>Notes:</strong> {item.notes || "—"}
        </p>

        <div className="flex gap-2 flex-wrap mt-4">
          {(item.images || []).map((url, i) => (
            <img
              key={i}
              src={url}
              className="w-24 h-24 object-cover rounded"
              loading="lazy"
              alt={`Image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
