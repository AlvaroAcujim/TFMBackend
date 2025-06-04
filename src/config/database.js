const mongoose = require('mongoose');
const config = require('../../config.js');
const user = config.DB_USER;
const pass = config.DB_PASS;
const connectDB = async() => {
    try{
        await mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.uxlva.mongodb.net/TFM?retryWrites=true&w=majority&appName=Cluster0`)
        console.log('Conexión a la base de datos establecida correctamente');
    } catch(err){
        console.log('Error al conectar a la BBDD: ', err);
        process.exit(1);
    }
};
module.exports = connectDB;