import { useEffect, useState } from "react";

interface ModalProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

export default function Modal({ images, startIndex, onClose }: ModalProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex flex-col items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 px-3 py-1 rounded"
      >
        ←
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 px-3 py-1 rounded"
      >
        →
      </button>

      <img
        src={images[currentIndex]}
        alt="Pokemon"
        className="max-h-[70vh] max-w-[90vw] rounded shadow mb-4 z-20"
      />
      <span className="text-white text-lg font-semibold mb-2 z-20">
        {currentIndex + 1} of {images.length}
      </span>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 z-20">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`h-16 w-16 rounded cursor-pointer border-2 ${
              i === currentIndex ? "border-blue-500" : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
