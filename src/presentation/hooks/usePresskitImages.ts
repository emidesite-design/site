import { useEffect, useState } from "react";
import type { PresskitImage } from "@/domain/entities/presskit";
import { readCachedValue, writeCachedValue } from "@/shared/lib/browserCache";
import { supabase } from "@/shared/lib/supabase";

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
    const presskitBucket = import.meta.env.VITE_SUPABASE_PRESSKIT_BUCKET?.trim();
    const presskitFolder = import.meta.env.VITE_SUPABASE_PRESSKIT_FOLDER?.trim() ?? "";
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

    async function fetchStorageImages(): Promise<PresskitImage[] | null> {
      if (!presskitBucket) {
        return null;
      }

      try {
        const { data, error } = await supabase.storage
          .from(presskitBucket)
          .list(presskitFolder, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        if (error || !data) {
          return null;
        }

        const images = data
          .filter((file) => Boolean(file.name))
          .map((file, index) => {
            const objectPath = presskitFolder ? `${presskitFolder}/${file.name}` : file.name;
            const { data: publicUrlData } = supabase.storage
              .from(presskitBucket)
              .getPublicUrl(objectPath);

            return normalizeImage(
              {
                id: file.id ?? objectPath,
                url: publicUrlData.publicUrl,
                alt: file.name,
              },
              index,
            );
          })
          .filter((image): image is PresskitImage => Boolean(image));

        return images;
      } catch {
        return null;
      }
    }

    async function loadImages() {
      const cachedImages = readCachedValue<PresskitImage[]>(PRESSKIT_CACHE_KEY);

      if (cachedImages && cachedImages.length > 0) {
        return cachedImages;
      }

      for (const source of sources) {
        const images = await fetchImages(source);

        if (images && images.length > 0) {
          writeCachedValue(PRESSKIT_CACHE_KEY, images, PRESSKIT_CACHE_TTL_MS);
          return images;
        }
      }

      const storageImages = await fetchStorageImages();

      if (storageImages && storageImages.length > 0) {
        writeCachedValue(PRESSKIT_CACHE_KEY, storageImages, PRESSKIT_CACHE_TTL_MS);
        return storageImages;
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
