import React, { useState } from 'react';

function ProductImageSlideshow({ images, name }) {
  const [current, setCurrent] = useState(0);
  const hasImages = images && images.length > 0;

  const goPrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (!hasImages) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 w-full aspect-square bg-white rounded-xl mb-4">
        <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-2 md:mb-4">📷</div>
        <p className="text-xs sm:text-sm md:text-base">Product Image</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden mb-4">
      <img
        src={images[current]}
        alt={name}
        className="w-full h-full object-contain transition-transform duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-orange-100"
            aria-label="Previous image"
          >
            <span className="text-2xl">&#8592;</span>
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-orange-100"
            aria-label="Next image"
          >
            <span className="text-2xl">&#8594;</span>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === current ? 'bg-orange-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductImageSlideshow;
