const {uploadFile, downloadFile} = require('../services/fileService');

const fileController = {
    uploadAndReplaceImage: [
        async(req, res) => {
            try{
                  const userId = req.user.id; // ID del usuario
                  const imageUrl = req.file.path; // URL de Cloudinary
            
                if (!file) return res.status(400).json({ error: 'Archivo no proporcionado' });
            
                const updatedDoc = await uploadFile(userId, imageUrl);
            
                res.status(200).json({message: 'Imagen subida y actualizada correctamente', data: updatedDoc});
            }catch(err){
                console.log('Error al subir la imagen', err);
                res.status(500).json({error: 'Error al subir imagen'});
            } 
        }
    ],
    serveImage: [
        async(req, res) => {
            const filename = req.params.filename;
  
            try {
              const filePath = await downloadFile(filename);
          
              // Enviar archivo al navegador (inline)
              res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
              res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500/frontend/');
              res.sendFile(filePath);
            } catch (err) {
              console.error('Error al servir imagen:', err);
              res.status(404).json({ error: err.message });
            }   
        }
    ]
}

module.exports = fileController;