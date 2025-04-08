"use client";

import { VideoI } from "@/models/Video";
import { IKVideo } from "imagekitio-next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const VideoUnique = () => {
  const params = useParams();
  const id = params?.id as string;

  const [video, setVideo] = useState<VideoI>();

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch video");
        }
        const data = await res.json();
        setVideo(data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card bg-base-100 shadow-xl p-4">
        <figure className="relative">
          <div className="h-[70vh] aspect-[9/16] overflow-hidden rounded-xl shadow-lg">
            <IKVideo
              path={video.videourl}
              transformation={[
                {
                  height: "auto",
                  width: "auto",
                },
              ]}
              controls
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </figure>

        <div className="card-body p-4">
          <p className="text-sm text-base-content/70">{video?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoUnique;
