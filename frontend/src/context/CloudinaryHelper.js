/**
 * Get Cloudinary configuration from environment variables
 * @returns {Object} Cloudinary config
 */
const getCloudinaryConfig = () => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET in .env file');
  }

  return { cloudName, uploadPreset };
};

/**
 * Upload an image directly to Cloudinary from frontend
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} The Cloudinary URL of the uploaded image
 */
export const uploadImageToCloudinary = async (imageFile) => {
  try {
    const { cloudName, uploadPreset } = getCloudinaryConfig();

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} imageFiles - Array of image files to upload
 * @returns {Promise<string[]>} Array of Cloudinary URLs
 */
export const uploadMultipleImages = async (imageFiles) => {
  try {
    const uploadPromises = imageFiles.map(file => uploadImageToCloudinary(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};
