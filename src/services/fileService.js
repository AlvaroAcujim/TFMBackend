const fs = require("fs").promises;
const path = require("path");
const Exercise = require("../models/Exercise");
const User = require("../models/User");

const uploadDir = path.join(__dirname, "../uploads");
const exerciseDir = path.join(uploadDir, "exercise");
const userDir = path.join(uploadDir, "users");

const initializeUploadDir = async () => {
  try {
    await fs.access(uploadDir);
    await fs.access(exerciseDir);
    await fs.access(userDir);
  } catch (err) {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(exerciseDir, { recursive: true });
    await fs.mkdir(userDir, { recursive: true });
  }
};
const uploadFile = async (id, file) => {
  
  const updatedUser = await Model.findByIdAndUpdate(
  id,                            
  { $set: { image: file } },  
  { new: true }                      
);

  return updatedUser;
};
const downloadFile = async (filename) => {
  const filePath = path.join(exerciseDir, filename);

  try {
    await fs.access(filePath); // verifica existencia
    return filePath; // devuelve la ruta absoluta
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error("Archivo no encontrado");
    } else {
      throw err;
    }
  }
};
const getImagesBase64ByFilenames = async (filenames) => {
   const images = await Promise.all(
    filenames.map(async (filename) => {
      const imagePath = path.join(exerciseDir, filename);
      const imageData = await fs.readFile(imagePath);
      const base64Image = imageData.toString('base64');

      // Detectar extensión y asignar MIME type
      const ext = path.extname(filename).toLowerCase(); // ej: '.webp', '.svg'
      let mimeType = 'image/jpeg'; // default

      if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.svg') mimeType = 'image/svg+xml';
      else if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.gif') mimeType = 'image/gif';

      return {
        filename,
        base64Image: `data:${mimeType};base64,${base64Image}`
      };
    })
  );
  return images;
};
initializeUploadDir();

module.exports = { uploadFile, downloadFile, getImagesBase64ByFilenames };
