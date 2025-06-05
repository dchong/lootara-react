// PokemonCard.tsx
import React, { useState } from "react";

type PokemonCardProps = {
  card: any;
  onImageClick: (index: number) => void;
};

export default function PokemonStorefrontCard({
  card,
  onImageClick,
}: PokemonCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = card.images || [];

  const updateMainImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-white p-4 rounded fade-in">
      <div className="flex flex-col items-center">
        <div className="relative rounded overflow-hidden">
          <img
            src={images[currentImageIndex]}
            className="h-60 w-full object-contain mb-2 cursor-pointer main-image hover:scale-105 transition duration-300 shadow-xl"
            onClick={() => onImageClick(currentImageIndex)}
          />
          {images.length > 1 && (
            <>
              <div
                className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white text-xl bg-gray-800 bg-opacity-50 px-2 py-1 cursor-pointer"
                onClick={() =>
                  updateMainImage(
                    (currentImageIndex - 1 + images.length) % images.length
                  )
                }
              >
                &#8592;
              </div>
              <div
                className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white text-xl bg-gray-800 bg-opacity-50 px-2 py-1 cursor-pointer"
                onClick={() =>
                  updateMainImage((currentImageIndex + 1) % images.length)
                }
              >
                &#8594;
              </div>
            </>
          )}
        </div>
        <div className="flex gap-1 mt-1">
          {images.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              className={`h-12 w-12 object-cover rounded cursor-pointer border-2 ${
                i === currentImageIndex
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => updateMainImage(i)}
            />
          ))}
        </div>
        <h2 className="text-lg font-bold mt-2">{card.name}</h2>
        <p className="text-sm text-gray-600 italic">{card.set || ""}</p>
        <p className="text-sm text-gray-600 italic">{card.condition || ""}</p>
        <div className="flex justify-between items-center mt-2 w-full">
          <span className="text-xl font-semibold text-green-600">
            ${card.price}
          </span>
          <a
            href={card.stripeLink}
            target="_blank"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
            rel="noreferrer"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}
