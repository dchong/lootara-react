// PokemonCard.tsx
import { useState } from "react";
import { PokemonProduct } from "../types";
import DetailModal from "./DetailModal";
import { StatusBgClass } from "@/helper";

interface Props {
  data: PokemonProduct;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
}

const PokemonCard = ({ data, onEdit, onDelete, isSelected, onSelect }: Props) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        className={`${StatusBgClass(
          data.status
        )} p-4 rounded shadow flex flex-col h-full min-h-[340px] transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer`}
        onClick={() => setShowDetail(true)}
      >
        {/* Checkbox */}
        {onSelect && (
          <div className="mb-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(data.id ?? "", e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm">Select</span>
            </label>
          </div>
        )}

        {/* Card Content */}
        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{data.name}</h3>
          <p className="text-sm text-gray-600">
            Set: {data.set || "—"} | Condition: {data.condition || "—"}
          </p>
          <p className="text-sm">
            Price: ${data.price} | Purchase: ${data.purchasePrice || 0} |
            Status: {data.status}
          </p>
          <p className="text-sm">Storage Bin: {data.location || "—"}</p>
          <p className="text-sm">Purchased From: {data.purchasedFrom || "—"}</p>
          <p className="text-sm line-clamp-2">Notes: {data.notes || "—"}</p>

          <div className="overflow-x-auto mt-2">
            <div className="flex gap-2 w-max">
              {(data.images || []).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className="w-20 h-20 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Edit/Delete Buttons */}
        {(onEdit || onDelete) && (
          <div
            className="mt-auto pt-4 flex gap-2 z-10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={onEdit}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <DetailModal item={data} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
};

export default PokemonCard;
