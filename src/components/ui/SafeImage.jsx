import { useState } from 'react';

export default function SafeImage({ src, fallback, alt = '', className = '', ...props }) {
  const [url, setUrl] = useState(src || fallback);

  return (
    <img
      {...props}
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (fallback && url !== fallback) setUrl(fallback);
      }}
    />
  );
}
