import { useState } from "react";
import { BearbrickProduct } from "../types";
import DetailModal from "./DetailModal";

interface Props {
  data: BearbrickProduct;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BearbrickCard = ({ data, onEdit, onDelete }: Props) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        className="bg-white p-4 rounded shadow flex flex-col h-full min-h-[340px] transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{data.name}</h3>
          <p className="text-sm text-gray-600">
            Series: {data.series || "—"} | Size: {data.size || "—"}
          </p>
          <p className="text-sm">
            Price: ${data.price} | Purchase: ${data.purchasePrice || 0} |
            Status: {data.status}
          </p>
          <p className="text-sm">Storage Bin: {data.location || "—"}</p>
          <p className="text-sm">Purchased From: {data.purchasedFrom || "—"}</p>
          <p className="text-sm line-clamp-2">Notes: {data.notes || "—"}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            {(data.images || []).map((img, idx) => (
              <img
                key={idx}
                src={img}
                className="w-20 h-20 object-cover rounded"
                loading="lazy"
              />
            ))}
          </div>
        </div>

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

      {showDetail && (
        <DetailModal item={data} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
};

export default BearbrickCard;
