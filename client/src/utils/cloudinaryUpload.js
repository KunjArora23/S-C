import axios from 'axios';
import { apiCall } from '../config/api';

export async function uploadImageToCloudinary(file, folder) {
  const signatureData = await apiCall.post('/admin/cloudinary-signature', { folder });

  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append('file', file);
  cloudinaryFormData.append('api_key', signatureData.apiKey);
  cloudinaryFormData.append('timestamp', signatureData.timestamp);
  cloudinaryFormData.append('signature', signatureData.signature);
  cloudinaryFormData.append('folder', signatureData.folder);

  const cloudinaryResponse = await axios.post(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    cloudinaryFormData
  );

  if (!cloudinaryResponse.data?.secure_url) {
    throw new Error('Cloudinary upload failed');
  }

  return cloudinaryResponse.data.secure_url;
}
