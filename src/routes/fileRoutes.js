const express = require('express');
const multer = require('multer');
const fileController  = require('../controllers/fileController');
const setCORPHeader = require('../middlewares/crossOriginResourcePolicy');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/image/:model/:filename', setCORPHeader, fileController.serveImage);
module.exports = router;