import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import PokemonCard from "./PokemonCard";
import BearbrickCard from "./BearbrickCard";

interface Props {
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onBulkUpdate: (newStatus: string, onDone?: () => void) => void;
}

export default function AcquiredView({
  selectedIds = [],
  onSelect,
  onBulkUpdate,
}: Props) {
  const [acquiredItems, setAcquiredItems] = useState<any[]>([]);

  const fetchAcquired = async () => {
    const [pokemonSnap, bearbrickSnap] = await Promise.all([
      getDocs(collection(db, "pokemon")),
      getDocs(collection(db, "bearbricks")),
    ]);

    const pokemon = pokemonSnap.docs
      .map((doc) => ({ id: doc.id, ...doc.data(), type: "pokemon" }))
      .filter((item) => item.status === "Acquired");

    const bearbricks = bearbrickSnap.docs
      .map((doc) => ({ id: doc.id, ...doc.data(), type: "bearbrick" }))
      .filter((item) => item.status === "Acquired");

    setAcquiredItems([...pokemon, ...bearbricks]);
  };

  useEffect(() => {
    fetchAcquired();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Acquired Items</h2>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <select
            onChange={(e) => {
              const newStatus = e.target.value;
              onBulkUpdate(newStatus, () => {
                fetchAcquired();
              });
            }}
            defaultValue=""
            className="border px-3 py-2 rounded"
          >
            <option value="" disabled>
              Select bulk action
            </option>
            <option value="Inventory">Mark as Inventory</option>
            <option value="Personal">Move to Personal</option>
          </select>
          <span className="text-sm text-gray-600">
            {selectedIds.length} selected
          </span>
        </div>
      )}

      {acquiredItems.map((item) => {
        if (item.type === "pokemon") {
          return (
            <PokemonCard
              key={item.id}
              data={item}
              isSelected={selectedIds.includes(item.id)}
              onSelect={onSelect}
            />
          );
        } else {
          return (
            <BearbrickCard
              key={item.id}
              data={item}
              isSelected={selectedIds.includes(item.id)}
              onSelect={onSelect}
            />
          );
        }
      })}
    </div>
  );
}
