

/**
 * Get Cloudinary configuration from environment variables
 * @returns Cloudinary config
 */
const getCloudinaryConfig = () => {
  const cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const upload_preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  console.log('Cloudinary Config Retrieved:', {cloud_name, upload_preset});

  return {cloud_name, upload_preset};
}


/**
 * Upload an image directly to Cloudinary from frontend
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} The Cloudinary URL of the uploaded image
 */
export  async function uploadImageToCloudinary(imageFile) {
  try {
    const {cloud_name, upload_preset} = getCloudinaryConfig();
    console.log('Cloudinary Config:', {cloud_name, upload_preset});

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('cloud_name', cloud_name); 
    formData.append('upload_preset', upload_preset); // Use your upload preset
    formData.append('resource_type', 'image'); 

    const response = await fetch(
       `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
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
  const uploadPromises = imageFiles.map(file => uploadImageToCloudinary(file));
  return Promise.all(uploadPromises);
};
