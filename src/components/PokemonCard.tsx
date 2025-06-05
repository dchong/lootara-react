interface Props {
  data: any; // You can tighten this to PokemonProduct if you're sure
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
}

const PokemonCard = ({
  data = {},
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
}: Props) => {
  const images = Array.isArray(data.images) ? data.images : [];

  return (
    <div className="bg-white p-4 rounded shadow relative">
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(data.id, e.target.checked)}
          className="absolute top-2 right-2"
        />
      )}
      <h3 className="font-bold text-lg">{data.name}</h3>
      <p className="text-sm text-gray-600">Status: {data.status}</p>
      <p className="text-sm text-gray-600">Set: {data.set || "—"}</p>
      <p className="text-sm text-gray-600">
        Condition: {data.condition || "—"}
      </p>
      <p className="text-sm">List Price: ${data.price}</p>
      <p className="text-sm">Purchase: ${data.purchasePrice || 0}</p>
      <p className="text-sm">Storage Bin: {data.location || "—"}</p>
      <p className="text-sm">Notes: {data.notes || "—"}</p>

      <div className="flex flex-wrap gap-2 mt-2">
        {images.map((img: string, idx: number) => (
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

export default PokemonCard;
