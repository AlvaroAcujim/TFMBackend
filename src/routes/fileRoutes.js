const express = require('express');
const multer = require('multer');
const fileController  = require('../controllers/fileController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/image/:model/:filename', fileController.serveImage);
module.exports = router;