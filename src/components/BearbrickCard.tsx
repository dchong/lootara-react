import { BearbrickProduct } from "../types";

interface Props {
  data: BearbrickProduct;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BearbrickCard = ({ data, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg">{data.name}</h3>
      <p className="text-sm text-gray-600">
        Set: {data.set || "—"} | Condition: {data.condition || "—"}
      </p>
      <p className="text-sm">
        Price: ${data.price} | Purchase: ${data.purchasePrice || 0} | Status:{" "}
        {data.status}
      </p>
      <p className="text-sm">Storage Bin: {data.location || "—"}</p>
      <p className="text-sm">Purchased From: {data.purchasedFrom || "—"}</p>
      <p className="text-sm">Notes: {data.notes || "—"}</p>

      <div className="flex flex-wrap gap-2 mt-2">
        {(data.images || []).map((img, idx) => (
          <img key={idx} src={img} className="w-20 h-20 object-cover rounded" />
        ))}
      </div>

      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
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
  );
};

export default BearbrickCard;
