const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dbttlvgb4",
  api_key: process.env.CLOUDINARY_API_KEY || "222928226579524",
  api_secret: process.env.CLOUDINARY_API_SECRET || "mN9UITNfGtOwyPKptcATqSetFOs",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

module.exports = { cloudinary, storage };