import imageCompression from "browser-image-compression";

export const compressAndUploadImage = async (file: File): Promise<File> => {
  const compressedImage = await imageCompression(file, {
    maxSizeMB: 0.05, // Maximum size in MB (50KB)
    maxWidthOrHeight: 1024, // Maximum width or height
    useWebWorker: true, // Use web worker for better performance
  });

  return compressedImage;
};
