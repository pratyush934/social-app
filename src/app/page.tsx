import { apiClient } from "@/lib/api-client";
import { VideoI } from "@/models/Video";
import { CloudCog } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState<VideoI[]>();

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (e) {
        console.error();
      }
    };
    fetchAllVideos();
  }, []);

  return (
    <div>
      <h1>ChaiCode</h1>
    </div>
  );
}
