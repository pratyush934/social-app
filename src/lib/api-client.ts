import { VideoI } from "@/models/Video";

export type VideoFormat = Omit<VideoI, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "content-type": "application/json",
      ...headers,
    };

    const response = await fetch(`api/${endpoint}`, {
      method: method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read the response body as text
      console.error(`Error: ${errorText}`); // Log the error
      throw new Error(errorText); // Throw an error with the response text
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch<VideoI[]>("/videos");
  }

  async getVideoById(id: string) {
    return this.fetch<VideoI>(`/videos/${id}`);
  }

  async postVideo(video: VideoFormat) {
    return this.fetch(`/videos`, {
      method: "POST",
      body: video,
    });
  }
}

export const apiClient = new ApiClient();
