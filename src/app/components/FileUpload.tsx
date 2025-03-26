"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  const uploadRef = useRef<HTMLInputElement | null>(null);

  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
    setUploadComplete(false);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    console.log("Upload Success - Full Response:", res);
    console.log("File URL:", res.url);
    console.log("File Path:", res.filePath);
    console.log("Thumbnail URL:", res.thumbnailUrl);

    setUploading(false);
    setError(null);
    onSuccess(res);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));

      // Check if upload is complete
      if (percentComplete === 100) {
        setUploadComplete(true);
      }
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validVideoTypes.includes(file.type)) {
        setError("Please upload a valid video file (MP4, WebM, OGG)");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Please upload a short file (max 100MB)");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid file (JPEG, PNG, WebP)");
        return false;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError("Please upload a short file (max 100MB)");
        return false;
      }
    }

    return true;
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
    setUploadComplete(false);
  };

  const triggerUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        useUniqueFileName={true}
        responseFields={["tags", "url", "thumbnailUrl", "filePath"]}
        validateFile={validateFile}
        folder={fileType === "video" ? "/videos" : "/images"}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleStartUpload}
        transformation={{
          pre: "l-text,i-Imagekit,fs-50,l-end",
          post: [
            {
              type: "transformation",
              value: "w-100",
            },
          ],
        }}
      />

      <button
        type="button"
        className="btn btn-secondary"
        onClick={triggerUpload}
      >
        Upload {fileType === "video" ? "Video" : "Image"}
      </button>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
