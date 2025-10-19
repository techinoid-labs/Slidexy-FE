declare module "recordrtc" {
  export default class RecordRTC {
    constructor(
      stream: MediaStream,
      options?: {
        type?: "audio" | "video" | "gif";
        mimeType?: string;
        frameRate?: number;
        quality?: number;
        recorderType?: any;
        disableLogs?: boolean;
        canvas?: { width: number; height: number };
      }
    );

    startRecording(): void;
    stopRecording(callback: () => void): void;
    pauseRecording(): void;
    resumeRecording(): void;
    reset(): void;
    save(fileName?: string): void;
    getBlob(): Blob;
    getDataURL(callback: (dataURL: string) => void): void;
  }
}
