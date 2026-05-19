import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';

export default function PhotoGalleryModal({ photos, open, onClose, initialIndex = 0 }) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, photos.length, onClose]);

  if (!open || !photos?.length) return null;

  return (
    <section className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute right-4 top-4 text-white text-2xl" onClick={onClose} aria-label="Close">
        ×
      </button>
      <img src={photos[index]} alt={`Photo ${index + 1}`} className="max-h-[85vh] max-w-full rounded-lg object-contain" />
      {photos.length > 1 && (
        <>
          <Button
            variant="secondary"
            className="absolute left-4 top-1/2 -translate-y-1/2"
            onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
          >
            ←
          </Button>
          <Button
            variant="secondary"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onClick={() => setIndex((i) => (i + 1) % photos.length)}
          >
            →
          </Button>
          <section className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4">
            {photos.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                  i === index ? 'border-white' : 'border-transparent opacity-70'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </section>
        </>
      )}
    </section>
  );
}
