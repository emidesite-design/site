import { useEffect, useState } from "react";
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

export function useShortsVideos(): UseShortsVideosState {
  const [state, setState] = useState<UseShortsVideosState>({
    items: [],
    loading: true,
  });

  useEffect(() => {
    let active = true;

    async function loadShorts() {
      try {
        const { data, error } = await supabase
          .from("shorts")
          .select("id, link")
          .order("id", { ascending: true });

        if (error || !data) {
          return [];
        }

        return data
          .map((row, index) => mapShortToVideo(row as ShortRow, index))
          .filter((item): item is ShortVideoItem => Boolean(item));
      } catch {
        return [];
      }
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
