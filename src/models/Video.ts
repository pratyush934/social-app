import mongoose, { model, models, Schema } from "mongoose";

export const VIDEODIMENSION = {
  height: 1080,
  width: 1920,
} as const;

export interface VideoI {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videourl: string;
  thumbnailurl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<VideoI>(
  {
    title: { required: true, type: String },
    description: { required: true, type: String },
    videourl: { required: true, type: String },
    thumbnailurl: { required: true, type: String },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEODIMENSION.height },
      width: { type: Number, default: VIDEODIMENSION.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  { timestamps: true }
);

const Video = models?.Video || model<VideoI>("Video", VideoSchema);

export default Video;
