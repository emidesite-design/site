import { useEffect, useState } from "react";
import type { PresskitImage } from "@/domain/entities/presskit";
import { readCachedValue, writeCachedValue } from "@/shared/lib/browserCache";

interface PresskitResponse {
  images?: PresskitImage[];
}

interface UsePresskitImagesState {
  images: PresskitImage[];
  loading: boolean;
}

const PRESSKIT_CACHE_KEY = "presskit-images-v1";
const PRESSKIT_CACHE_TTL_MS = 1000 * 60 * 60;

function normalizeImage(image: Partial<PresskitImage>, index: number): PresskitImage | null {
  if (!image.url) {
    return null;
  }

  return {
    id: image.id?.trim() || `presskit-${index + 1}`,
    url: image.url,
    width: Number(image.width) > 0 ? Number(image.width) : 720,
    height: Number(image.height) > 0 ? Number(image.height) : 960,
    alt: image.alt?.trim() || undefined,
  };
}

export function usePresskitImages(): UsePresskitImagesState {
  const [state, setState] = useState<UsePresskitImagesState>({
    images: [],
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const manifestUrl = import.meta.env.VITE_SUPABASE_PRESSKIT_URL?.trim();
    const sources = manifestUrl ? [manifestUrl, "/data/presskit.json"] : ["/data/presskit.json"];

    async function fetchImages(source: string): Promise<PresskitImage[] | null> {
      try {
        const response = await fetch(source, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Unable to fetch presskit manifest from ${source}.`, response.status);
          return null;
        }

        const payload = (await response.json()) as PresskitResponse;

        return (payload.images ?? [])
          .map((image, index) => normalizeImage(image, index))
          .filter((image): image is PresskitImage => Boolean(image));
      } catch (error) {
        console.error(`Unexpected error while fetching presskit manifest from ${source}.`, error);
        return null;
      }
    }

    async function loadImages() {
      const cachedImages = readCachedValue<PresskitImage[]>(PRESSKIT_CACHE_KEY);

      if (cachedImages) {
        return cachedImages;
      }

      for (const source of sources) {
        const images = await fetchImages(source);

        if (images) {
          writeCachedValue(PRESSKIT_CACHE_KEY, images, PRESSKIT_CACHE_TTL_MS);
          return images;
        }
      }

      return [];
    }

    loadImages()
      .then((images) => {
        if (!active) {
          return;
        }

        setState({
          images,
          loading: false,
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
