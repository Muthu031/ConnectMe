const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<object>} - Upload result
 */
const uploadImage = async (filePath, folder = 'connectme') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1080, height: 1080, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Upload video to Cloudinary
 * @param {string} filePath - Path to the video file
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<object>} - Upload result
 */
const uploadVideo = async (filePath, folder = 'connectme/videos') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'video',
      transformation: [
        { width: 720, crop: 'scale' },
        { quality: 'auto' }
      ]
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary video upload failed: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file
 * @param {string} resourceType - Type of resource ('image' or 'video')
 * @returns {Promise<object>} - Deletion result
 */
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadVideo,
  deleteFile
};
