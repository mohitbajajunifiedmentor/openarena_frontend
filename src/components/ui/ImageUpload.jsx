import { useState } from 'react';
import { fileToDataUrl } from '../../utils/images.js';
import Button from './Button.jsx';

export default function ImageUpload({ label, value, onChange, multiple = false, max = 5 }) {
  const [error, setError] = useState('');

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError('');
    try {
      if (multiple) {
        const urls = [];
        for (const file of files.slice(0, max - (value?.length || 0))) {
          urls.push(await fileToDataUrl(file));
        }
        onChange([...(value || []), ...urls]);
      } else {
        onChange(await fileToDataUrl(files[0]));
      }
      e.target.value = '';
    } catch (err) {
      setError(err.message);
    }
  };

  const removeAt = (i) => {
    if (multiple) onChange(value.filter((_, idx) => idx !== i));
    else onChange('');
  };

  const previews = multiple ? value || [] : value ? [value] : [];

  return (
    <section className="space-y-2">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <section className="flex flex-wrap gap-3">
        {previews.map((src, i) => (
          <figure key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
            >
              ×
            </button>
          </figure>
        ))}
        {(!multiple || (value?.length || 0) < max) && (
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-xs text-muted hover:border-brand-400 hover:text-brand-700">
            <span>+ Add</span>
            <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleFiles} />
          </label>
        )}
      </section>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {multiple && (
        <p className="text-xs text-muted">Up to {max} images, max 1.5MB each</p>
      )}
    </section>
  );
}
