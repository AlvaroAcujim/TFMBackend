const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendConfirmEmail} = require('./emailService');
//si se despliega meter en .env
const config = require('../../config.js');
const SECRET_KEY = config.SECRET_KEY;

    const insertUser = async (userData) => {
        try {
            const { name, username, password, email, role } = userData;

            const existUser = await User.findOne({username});
            const existUserMail = await User.findOne({email});
            if(existUser || existUserMail){
                throw new Error('Ya existe un usuario con ese username o email')
            }
            if(!username || !name || !password || !email || !role){
                throw new Error('username, name, password, email y role son requeridos')
            }
            console.log('Hashing password');
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Hashed password -> ', hashedPassword);

            const user = new User({
                name,
                username, 
                password: hashedPassword, 
                email,
                role: role || 'user'
            });
            await user.save();
            await sendConfirmEmail(email);
            return user
        } catch (err) {
            console.log('Error al crear usuario: ' , err);
            throw err;
        }
  };
    const getUserByid = async(id) => {
        try {
            const user = await User.findById(id).select('username image role');
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            console.log('Usuario encontrado:', user);
            return user;
        } catch (err) {
            console.error('Error al obtener usuario por username:', err);
            throw err;
        }
  }

  const getUserByUsernameOrEmail = async(identifier) => {
    try{
        const input = identifier.includes('@') ? {email: identifier} : {username: identifier};
        const user = await User.findOne(input).select('username image role');
        if(!user){
            throw new Error('Error al recoger el usuario por username o email');
        }
        return user;
    }catch(err){
        console.log('Error al obtener usuario: ' , err);
        throw err;
    }
  }
  
    const loginUser = async (identifier, password) => {
        try {
            const input = identifier.includes('@') ? {email: identifier} : {username: identifier};
            const user = await User.findOne(input);
            if (!user) {
                throw new Error('Usuario no encontrado');
            } 
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Contraseña incorrecta');
            }
    
            const token = jwt.sign(
                {   id: user._id, 
                    role: user.role},
                    SECRET_KEY,
                {expiresIn: '1d'}
            );
            return token
        } catch (err) {
            console.log('Error al crear el token: ' , err);
            throw err;
        }
  };
  module.exports = {insertUser, getUserByid, loginUser, getUserByUsernameOrEmail};
