const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

export function getCloudinaryUrl(imagePath?: string | null, version?: string): string {

  const cloudinaryVersion = version || process.env.CLOUDINARY_DEFAULT_VERSION || "v1";

  // Construct URL till /media
  const baseURL = `${CLOUDINARY_BASE_URL}${cloudinaryVersion}/media/`;

  // Append the image path from database
  return `${baseURL}${imagePath}`;
}
