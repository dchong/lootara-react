import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// PokemonCard.tsx
import { useState } from "react";
export default function PokemonCard({ card, onImageClick }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = card.images || [];
    const updateMainImage = (index) => {
        setCurrentImageIndex(index);
    };
    return (_jsx("div", { className: "bg-white p-4 rounded fade-in", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative rounded overflow-hidden", children: [_jsx("img", { src: images[currentImageIndex], className: "h-60 w-full object-contain mb-2 cursor-pointer main-image hover:scale-105 transition duration-300 shadow-xl", onClick: () => onImageClick(currentImageIndex) }), images.length > 1 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute top-1/2 left-0 transform -translate-y-1/2 text-white text-xl bg-gray-800 bg-opacity-50 px-2 py-1 cursor-pointer", onClick: () => updateMainImage((currentImageIndex - 1 + images.length) % images.length), children: "\u2190" }), _jsx("div", { className: "absolute top-1/2 right-0 transform -translate-y-1/2 text-white text-xl bg-gray-800 bg-opacity-50 px-2 py-1 cursor-pointer", onClick: () => updateMainImage((currentImageIndex + 1) % images.length), children: "\u2192" })] }))] }), _jsx("div", { className: "flex gap-1 mt-1", children: images.map((img, i) => (_jsx("img", { src: img, className: `h-12 w-12 object-cover rounded cursor-pointer border-2 ${i === currentImageIndex
                            ? "border-blue-500"
                            : "border-transparent"}`, onClick: () => updateMainImage(i) }, i))) }), _jsx("h2", { className: "text-lg font-bold mt-2", children: card.name }), _jsx("p", { className: "text-sm text-gray-600 italic", children: card.set || "" }), _jsx("p", { className: "text-sm text-gray-600 italic", children: card.condition || "" }), _jsxs("div", { className: "flex justify-between items-center mt-2 w-full", children: [_jsxs("span", { className: "text-xl font-semibold text-green-600", children: ["$", card.price] }), _jsx("a", { href: card.stripeLink, target: "_blank", className: "bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition", rel: "noreferrer", children: "Buy Now" })] })] }) }));
}
