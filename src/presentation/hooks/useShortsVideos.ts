import { useEffect, useState } from "react";
import { readCachedValue, writeCachedValue } from "@/shared/lib/browserCache";
import { supabase } from "@/shared/lib/supabase";

export interface ShortVideoItem {
  id: string;
  title: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  embedUrl: string;
}

interface ShortRow {
  id: string | number;
  link: string;
}

interface UseShortsVideosState {
  items: ShortVideoItem[];
  loading: boolean;
}

interface ShortsManifestItem {
  id?: string | number;
  title?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  embedUrl?: string;
  link?: string;
}

interface ShortsManifestResponse {
  items?: ShortsManifestItem[];
}

const SHORTS_CACHE_KEY = "shorts-videos-v1";
const SHORTS_CACHE_TTL_MS = 1000 * 60 * 60;

function extractYouTubeVideoId(link: string): string | null {
  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      const parts = url.pathname.split("/").filter(Boolean);

      if (parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live") {
        return parts[1] ?? null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function formatShortTitle(index: number): string {
  return `Short ${String(index + 1).padStart(2, "0")}`;
}

function mapShortToVideo(row: ShortRow, index: number): ShortVideoItem | null {
  const videoId = extractYouTubeVideoId(row.link);

  if (!videoId) {
    return null;
  }

  const title = formatShortTitle(index);

  return {
    id: String(row.id),
    title,
    thumbnailSrc: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    thumbnailAlt: `${title} thumbnail`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
  };
}

function normalizeManifestShort(item: ShortsManifestItem, index: number): ShortVideoItem | null {
  if (item.embedUrl && item.thumbnailSrc) {
    const title = item.title?.trim() || formatShortTitle(index);

    return {
      id: String(item.id ?? title),
      title,
      thumbnailSrc: item.thumbnailSrc,
      thumbnailAlt: item.thumbnailAlt?.trim() || `${title} thumbnail`,
      embedUrl: item.embedUrl,
    };
  }

  if (item.link) {
    return mapShortToVideo(
      {
        id: item.id ?? index,
        link: item.link,
      },
      index,
    );
  }

  return null;
}

export function useShortsVideos(): UseShortsVideosState {
  const [state, setState] = useState<UseShortsVideosState>({
    items: [],
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const manifestUrl = import.meta.env.VITE_SUPABASE_SHORTS_URL?.trim();
    const sources = manifestUrl ? [manifestUrl, "/data/shorts.json"] : ["/data/shorts.json"];

    async function fetchShortsManifest(source: string): Promise<ShortVideoItem[] | null> {
      try {
        const response = await fetch(source, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          return null;
        }

        const payload = (await response.json()) as ShortsManifestResponse;

        return (payload.items ?? [])
          .map((item, index) => normalizeManifestShort(item, index))
          .filter((item): item is ShortVideoItem => Boolean(item));
      } catch {
        return null;
      }
    }

    async function fetchShortsFromSupabase(): Promise<ShortVideoItem[] | null> {
      try {
        const { data, error } = await supabase
          .from("shorts")
          .select("id, link")
          .order("id", { ascending: true });

        if (error || !data) {
          return null;
        }

        return data
          .map((row, index) => mapShortToVideo(row as ShortRow, index))
          .filter((item): item is ShortVideoItem => Boolean(item));
      } catch {
        return null;
      }
    }

    async function loadShorts() {
      const cachedItems = readCachedValue<ShortVideoItem[]>(SHORTS_CACHE_KEY);

      if (cachedItems && cachedItems.length > 0) {
        return cachedItems;
      }

      for (const source of sources) {
        const manifestItems = await fetchShortsManifest(source);

        if (manifestItems && manifestItems.length > 0) {
          writeCachedValue(SHORTS_CACHE_KEY, manifestItems, SHORTS_CACHE_TTL_MS);
          return manifestItems;
        }
      }

      const supabaseItems = await fetchShortsFromSupabase();

      if (supabaseItems && supabaseItems.length > 0) {
        writeCachedValue(SHORTS_CACHE_KEY, supabaseItems, SHORTS_CACHE_TTL_MS);
        return supabaseItems;
      }

      return [];
    }

    void loadShorts().then((items) => {
      if (!active) {
        return;
      }

      setState({
        items,
        loading: false,
      });
    });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
