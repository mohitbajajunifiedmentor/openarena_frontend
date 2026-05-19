/** Pexels CDN — reliable for venue cards (Unsplash photo-* IDs often 404). */
export function pexelsUrl(id, width = 1200) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&fit=crop`;
}

export const FALLBACK_SPORTS_IMAGE = pexelsUrl(274506, 800);
export const FALLBACK_EVENT_IMAGE = pexelsUrl(265631, 800);
