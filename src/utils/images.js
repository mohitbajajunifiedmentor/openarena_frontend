import { FALLBACK_EVENT_IMAGE, FALLBACK_SPORTS_IMAGE, pexelsUrl } from './venueImages.js';

export const DEFAULT_GROUND_IMAGE = FALLBACK_SPORTS_IMAGE;

export const HERO_IMAGE = pexelsUrl(274506, 1600);

/** Pexels — football on turf / outdoor sports ground */
export const HERO_VIDEO_SPORTS =
  'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_24fps.mp4';

/** Pexels — outdoor event / celebration space */
export const HERO_VIDEO_EVENT =
  'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4';

export const SPORTS_BANNER = pexelsUrl(399187, 800);

export const EVENT_BANNER = FALLBACK_EVENT_IMAGE;

export function getGroundImage(ground) {
  const photo = ground?.photos?.[0];
  if (!photo) {
    return ground?.groundType === 'event' ? FALLBACK_EVENT_IMAGE : FALLBACK_SPORTS_IMAGE;
  }
  return photo;
}

export function getGroundImageFallback(ground) {
  return ground?.groundType === 'event' ? FALLBACK_EVENT_IMAGE : FALLBACK_SPORTS_IMAGE;
}

export function getCategoryImage(category) {
  return category?.image || (category?.type === 'event' ? EVENT_BANNER : SPORTS_BANNER);
}

export function fileToDataUrl(file, maxMb = 1.5) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('Please select an image file'));
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      reject(new Error(`Image must be under ${maxMb}MB`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });
}
