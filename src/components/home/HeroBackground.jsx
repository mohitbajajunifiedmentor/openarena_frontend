import { useEffect, useState } from 'react';
import { HERO_IMAGE, HERO_VIDEO_EVENT, HERO_VIDEO_SPORTS } from '../../utils/images.js';

const CLIPS = [
  { src: HERO_VIDEO_SPORTS, label: 'Sports ground' },
  { src: HERO_VIDEO_EVENT, label: 'Event venue' },
];

export default function HeroBackground() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((v) => (v + 1) % CLIPS.length), 9000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {CLIPS.map((clip, i) => (
        <video
          key={clip.src}
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_IMAGE}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.8s] motion-reduce:hidden ${
            active === i ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={clip.src} type="video/mp4" />
        </video>
      ))}
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/90 via-brand-900/85 to-slate-900/88" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,255,255,0.12),transparent_55%)]" />
    </div>
  );
}
