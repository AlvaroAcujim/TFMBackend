require('dotenv').config;

module.exports = {
    DB_USER: process.env.DB_USER || 'alvaroacu',
    DB_PASS: process.env.DB_PASS || 'pB18CuGiZF5q2Veo',
    PORT: process.env.PORT || 3000,
    SECRET_KEY: process.env.SECRET_KEY || 'Bandolero4life',
    DB_HOST: process.env.DB_HOST || '127.0.01'
}