const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const requiredCloudEnv = [
  'CLOUD_NAME',
  'CLOUD_API_KEY',
  'CLOUD_API_SECRET'
];
const missingCloudEnv = requiredCloudEnv.filter((key) => !process.env[key]);
if (missingCloudEnv.length) {
  throw new Error(
    `Missing Cloudinary environment variables: ${missingCloudEnv.join(', ')}. ` +
    `Please set CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET in Render environment settings.`
  );
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"],
  },
});

module.exports = {
    cloudinary,storage,
};