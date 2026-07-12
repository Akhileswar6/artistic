const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Configure S3 Client (matches uploadMiddleware)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a pre-signed URL for an S3 object key.
 * If the key is already a full URL (e.g., from Cloudinary or an old public S3 URL),
 * or if it's a generic unavatar URL, it returns the URL as-is.
 * 
 * @param {string} key - The S3 object key or full URL
 * @returns {Promise<string|null>} The viewable URL
 */
const generatePresignedUrl = async (key) => {
  if (!key) return null;

  // If the key is already a full http/https URL, return it directly.
  // This handles existing Cloudinary links, Google auth profile pics, etc.
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    // URL expires in 3600 seconds (1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
};

module.exports = {
  generatePresignedUrl,
  s3Client
};
