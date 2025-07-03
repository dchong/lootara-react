// src/pages/Admin.tsx
import { useEffect, useState, useCallback, ChangeEvent } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  updateDoc,
  addDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import PokemonForm from "../components/PokemonForm";
import BearbrickForm from "../components/BearbrickForm";
import PokemonCard from "../components/PokemonCard";
import BearbrickCard from "../components/BearbrickCard";
import AcquiredView from "../components/AcquiredView";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { BaseProduct, PokemonProduct, BearbrickProduct } from "@/types";
import Papa from "papaparse";

type Tab = "pokemon" | "bearbricks" | "acquired" | "bulk";

const Admin = () => {
  useFirebaseAuth();
  const [activeTab, setActiveTab] = useState<Tab>("pokemon");
  const [products, setProducts] = useState<BaseProduct[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    PokemonProduct | BearbrickProduct | undefined
  >(undefined);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [csvUploadStatus, setCsvUploadStatus] = useState("");

  const fetchItems = useCallback(async () => {
    if (activeTab === "acquired" || activeTab === "bulk") return;

    const colRef = collection(db, activeTab);
    const q = includeArchived
      ? query(colRef, orderBy("name"))
      : query(colRef, where("status", "!=", "Archived"), orderBy("status"));

    const snap = await getDocs(q);

    if (activeTab === "pokemon") {
      const pokemon: PokemonProduct[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PokemonProduct, "id" | "type">),
        type: "pokemon",
      }));
      setProducts(pokemon);
    } else if (activeTab === "bearbricks") {
      const bearbricks: BearbrickProduct[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<BearbrickProduct, "id" | "type">),
        type: "bearbrick",
      }));
      setProducts(bearbricks);
    }
  }, [activeTab, includeArchived]);

  useEffect(() => {
    if (activeTab === "pokemon" || activeTab === "bearbricks") {
      fetchItems();
    }
  }, [activeTab, fetchItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, includeArchived]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, activeTab, id));
    fetchItems();
  };

  const handleEdit = (item: BaseProduct) => {
    setEditingProduct(item);
  };

  const handleFormSubmit = () => {
    fetchItems();
    setEditingProduct(undefined);
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  const handleBulkUpdate = async (newStatus: string, onDone?: () => void) => {
    const collectionsToSearch = ["pokemon", "bearbricks"];

    await Promise.all(
      collectionsToSearch.map(async (colName) => {
        const snap = await getDocs(collection(db, colName));
        const docsToUpdate = snap.docs.filter((doc) =>
          selectedIds.includes(doc.id)
        );
        await Promise.all(
          docsToUpdate.map((docSnap) =>
            updateDoc(doc(db, colName, docSnap.id), { status: newStatus })
          )
        );
      })
    );

    setSelectedIds([]);
    onDone?.();
  };

  const handleCsvUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvUploadStatus("Processing...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        let successCount = 0;
        let failCount = 0;

        const rows = result.data as any[];
        for (const [i, row] of rows.entries()) {
          try {
            const parseDate = (val: string) =>
              val && val.trim() !== "" ? new Date(val) : undefined;

            const parseNumber = (val: string) =>
              val && val.trim() !== "" ? parseFloat(val) : undefined;

            const rawPayload = {
              status: row.Status?.trim() || "",
              location: row.Bin?.trim() || "",
              name: row.Name?.trim() || "",
              cardNumber: row.CardNumber?.trim() || "",
              set: row.Set?.trim() || "",
              condition: row.Condition?.trim() || "",
              purchasePrice: parseNumber(row.PurchasePrice),
              purchasedFrom: row.PurchaseFrom?.trim() || "",
              purchaseDate: parseDate(row.PurchaseDate),
              price: parseNumber(row.ListingPrice),
              soldDate: parseDate(row.SoldDate),
              stripeLink: row.StripeLink?.trim() || "",
              listedOn: row.ListedOn?.trim() || "",
              notes: row.Notes?.trim() || "",
              orderNumber: row.OrderNumber?.trim() || "",
              platformFees: parseNumber(row.PlatformFees),
              shippingMaterialCost: parseNumber(row.ShippingMaterialCost),
              postageCost: parseNumber(row.PostageCost),
              shipDate: parseDate(row.ShipDate),
              tracking: row.Tracking?.trim() || "",
            };

            const payload = Object.fromEntries(
              Object.entries(rawPayload).filter(([_, v]) => v !== undefined)
            );

            if (!payload.name) {
              console.warn(`Row ${i + 2} skipped: missing required name`);
              failCount++;
              continue;
            }

            await addDoc(collection(db, "pokemon"), {
              ...payload,
              images: [],
              type: "pokemon",
            });

            successCount++;
          } catch (err) {
            console.error(`Row ${i + 2} failed:`, err);
            failCount++;
          }
        }

        setCsvUploadStatus(
          `Upload complete: ${successCount} added, ${failCount} failed.`
        );
      },
      error: (err) => {
        console.error("CSV parse error:", err);
        setCsvUploadStatus("Failed to parse CSV.");
      },
    });
  };

  const isPokemon = activeTab === "pokemon";
  const isBearbrick = activeTab === "bearbricks";
  const isAcquired = activeTab === "acquired";
  const isBulk = activeTab === "bulk";

  const filtered = products.filter((item) => {
    const matchSearch = item.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex space-x-4">
        {(["pokemon", "bearbricks", "acquired", "bulk"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {isBulk ? (
        <div className="bg-white p-6 rounded shadow space-y-4 max-w-xl">
          <h2 className="text-xl font-bold">Bulk Upload Pokémon Cards</h2>
          <input type="file" accept=".csv" onChange={handleCsvUpload} />
          {csvUploadStatus && (
            <p className="text-sm text-gray-700">{csvUploadStatus}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="w-full lg:w-1/2">
            {isPokemon && (
              <PokemonForm
                product={
                  editingProduct && editingProduct.type === "pokemon"
                    ? editingProduct
                    : undefined
                }
                onSubmit={handleFormSubmit}
              />
            )}
            {isBearbrick && (
              <BearbrickForm
                product={
                  editingProduct && editingProduct.type === "bearbrick"
                    ? editingProduct
                    : undefined
                }
                onSubmit={handleFormSubmit}
              />
            )}
            {isAcquired && (
              <AcquiredView
                selectedIds={selectedIds}
                onSelect={toggleSelect}
                onBulkUpdate={handleBulkUpdate}
              />
            )}
          </div>

          {(isPokemon || isBearbrick) && (
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded w-full sm:w-1/2"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded w-full sm:w-1/4"
                >
                  <option value="all">All Statuses</option>
                  {[
                    "Acquired",
                    "Inventory",
                    "Personal",
                    "Listed",
                    "Pending Sale",
                    "Sold",
                    "Archived",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeArchived}
                    onChange={() => setIncludeArchived((prev) => !prev)}
                  />
                  <span>Show Archived</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((item) => {
                  if (isPokemon && item.type === "pokemon") {
                    return (
                      <PokemonCard
                        key={item.id}
                        data={item}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item.id ?? "")}
                      />
                    );
                  }
                  if (isBearbrick && item.type === "bearbrick") {
                    return (
                      <BearbrickCard
                        key={item.id}
                        data={item}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item.id ?? "")}
                      />
                    );
                  }
                  return null;
                })}
              </div>

              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
