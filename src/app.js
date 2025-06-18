const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorMiddleware');
const notFoundHandler = require('./middlewares/notFoundHandler');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const exerciseTableRoutes = require('./routes/exerciseTableRoutes');
const fileRoutes = require('./routes/fileRoutes');
const app = express();
const axios = require('axios');
const config = require('../config.js');
app.use(express.json());

app.use(cookieParser());
//https://tfm-frontend-flame.vercel.app
app.use(cors(
  {
    origin: ['http://localhost:5173', 'https://tfm-frontend-flame.vercel.app'], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']              
  }
));
// Protección en cabeceras
app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );


app.use(mongoSanitize());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: 'Demasiadas peticiones desde esta IP',
  });

app.use('/api', apiLimiter);
app.use('/api/users', userRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/exerciseTable', exerciseTableRoutes);
app.use('/api/file', fileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
