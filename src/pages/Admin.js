import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import PokemonForm from "../components/PokemonForm";
import BearbrickForm from "../components/BearbrickForm";
const Admin = () => {
    useFirebaseAuth();
    const [activeTab, setActiveTab] = useState("pokemon");
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "mb-4 flex space-x-4", children: [_jsx("button", { onClick: () => setActiveTab("pokemon"), className: `px-4 py-2 rounded ${activeTab === "pokemon" ? "bg-blue-500 text-white" : "bg-gray-300"}`, children: "Pok\u00E9mon" }), _jsx("button", { onClick: () => setActiveTab("bearbricks"), className: `px-4 py-2 rounded ${activeTab === "bearbricks"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300"}`, children: "Bearbricks" })] }), activeTab === "pokemon" ? _jsx(PokemonForm, {}) : _jsx(BearbrickForm, {})] }));
};
export default Admin;
