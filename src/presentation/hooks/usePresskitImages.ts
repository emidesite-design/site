import { useEffect, useState } from "react";
import type { PresskitImage } from "@/domain/entities/presskit";
import { supabase } from "@/shared/lib/supabase";

interface PresskitResponse {
  images?: PresskitImage[];
}

interface UsePresskitImagesState {
  images: PresskitImage[];
  loading: boolean;
}

const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const DEFAULT_IMAGE_WIDTH = 720;
const DEFAULT_IMAGE_HEIGHT = 960;

function isImageFile(fileName: string): boolean {
  const normalizedFileName = fileName.toLowerCase();

  return Array.from(IMAGE_EXTENSIONS).some((extension) => normalizedFileName.endsWith(extension));
}

function toImageAlt(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export function usePresskitImages(): UsePresskitImagesState {
  const [state, setState] = useState<UsePresskitImagesState>({
    images: [],
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const presskitBucket = import.meta.env.VITE_SUPABASE_PRESSKIT_BUCKET?.trim();
    const presskitFolder = import.meta.env.VITE_SUPABASE_PRESSKIT_FOLDER?.trim() ?? "";
    const manifestUrl = import.meta.env.VITE_SUPABASE_PRESSKIT_URL?.trim();
    const sources = manifestUrl ? [manifestUrl, "/data/presskit.json"] : ["/data/presskit.json"];

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
          console.error("Unable to list Supabase presskit images.", error);
          return null;
        }

        const images = data
          .filter((file) => Boolean(file.name) && isImageFile(file.name))
          .map((file) => {
            const objectPath = presskitFolder ? `${presskitFolder}/${file.name}` : file.name;
            const { data: publicUrlData } = supabase.storage
              .from(presskitBucket)
              .getPublicUrl(objectPath);

            return {
              id: file.id ?? objectPath,
              url: publicUrlData.publicUrl,
              width: DEFAULT_IMAGE_WIDTH,
              height: DEFAULT_IMAGE_HEIGHT,
              alt: toImageAlt(file.name),
            };
          });

        return images;
      } catch (error) {
        console.error("Unexpected error while loading Supabase presskit images.", error);
        return null;
      }
    }

    async function fetchImages(source: string): Promise<PresskitImage[] | null> {
      try {
        const response = await fetch(source, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Unable to fetch presskit manifest from ${source}.`, response.status);
          return null;
        }

        const payload = (await response.json()) as PresskitResponse;

        return payload.images ?? [];
      } catch (error) {
        console.error(`Unexpected error while fetching presskit manifest from ${source}.`, error);
        return null;
      }
    }

    async function loadImages() {
      const storageImages = await fetchStorageImages();

      if (storageImages) {
        return storageImages;
      }

      for (const source of sources) {
        const images = await fetchImages(source);

        if (images) {
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
