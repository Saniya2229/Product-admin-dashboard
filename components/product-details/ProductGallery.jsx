import React from 'react';

export default function ProductGallery({
  title,
  activeImage,
  setActiveImage,
  allImages = [],
}) {
  return (
    <div className="lg:col-span-5 flex flex-col gap-4">
      {/* Primary Featured Image */}
      <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center justify-center overflow-hidden">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage}
            alt={title}
            className="w-full h-full object-contain transition-all duration-300"
          />
        ) : (
          <span className="text-slate-400 text-xs">No image preview</span>
        )}
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`w-16 h-16 rounded-xl border p-1 shrink-0 bg-slate-50 transition-all cursor-pointer overflow-hidden ${
                activeImage === img
                  ? 'border-blue-600 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
