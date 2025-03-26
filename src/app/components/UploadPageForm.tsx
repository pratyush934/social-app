"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    setValue,
    watch, // Add watch
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  // Then in your component
  const videoUrl = watch("videoUrl"); // This will watch the videoUrl field

  console.log("This is videoURl -----> ", videoUrl);

  const handleUploadSuccess = (response: IKUploadResponse) => {
    console.group("ImageKit Upload Debug");
    console.log("Full Response:", response);
    console.log("Response Type:", typeof response);
    console.log("Response Keys:", Object.keys(response));

    // Try to extract URL through multiple methods
    const videoUrl =
      response.url ||
      response.filePath ||
      response.fileUrl ||
      (response as any).file ||
      "";

    console.log("Extracted Video URL:", videoUrl);

    if (!videoUrl) {
      console.error("Could not extract video URL from response");
      showNotification("Failed to get video URL", "error");
      return;
    }

    setValue("videoUrl", videoUrl);
    setValue("thumbnailUrl", response.thumbnailUrl || videoUrl);

    console.groupEnd();
    showNotification("Video uploaded successfully!", "success");
  };
  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl || data.videoUrl.trim() === "") {
      showNotification("Please upload a video first", "error");
      return;
    }
    // ... rest of the function

    setLoading(true);
    try {
      await apiClient.postVideo({
        ...data,
        videourl: data.videoUrl,
        thumbnailurl: data.thumbnailUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      showNotification("Video published successfully!", "success");

      // Reset form after successful submission
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">Title</label>
        <input
          type="text"
          className={`input input-bordered ${
            errors.title ? "input-error" : ""
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-error text-sm mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">Description</label>
        <textarea
          className={`textarea textarea-bordered h-24 ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">Upload Video</label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading} // Remove uploadProgress check
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing Video...
          </>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}
