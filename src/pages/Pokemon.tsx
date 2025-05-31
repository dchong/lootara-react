// This will be the start of your Pokémon Storefront React component
// We'll fetch and display all listed Pokémon items from Firestore

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

export default function PokemonStorefront() {
  const [items, setItems] = useState<any[]>([]);

  const fetchListedPokemon = async () => {
    const q = query(collection(db, "pokemon"), where("status", "==", "Listed"));
    const snap = await getDocs(q);
    setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchListedPokemon();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pokémon Storefront</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded shadow p-4 bg-white hover:shadow-lg transition"
          >
            <img
              src={item.images?.[0] || ""}
              alt={item.name}
              loading="lazy"
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg mb-1">{item.name}</h2>
            <p className="text-sm text-gray-600">Set: {item.set}</p>
            <p className="text-sm text-gray-600">Condition: {item.condition}</p>
            <p className="text-blue-600 font-semibold mt-1">${item.price}</p>
            {item.stripeLink && (
              <a
                href={item.stripeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                Buy Now
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
