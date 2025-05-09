"use client";

import { apiClient } from "@/lib/api-client";
import { VideoI } from "@/models/Video";
import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import Header from "./components/Header";

export default function Home() {
  const [videos, setVideos] = useState<VideoI[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="mx-auto px-4 py-4">
      <Header />
      <h1 className="text-3xl font-bold mb-8 py-2">Social App</h1>
      <VideoFeed videos={videos} />
    </main>
  );
}
