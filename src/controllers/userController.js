const {insertUser, loginUser, getUserByid, getUserByUsernameOrEmail} = require('../services/userServices');
const {createUserValidations, getUserByIdValidation, loginValidation, getUserByIdentifierValidation} = require('../validations/userValidations')
const userController = {
    createUser: [
        ...createUserValidations,
        async (req, res) => {
            try{
                const newUser = await insertUser(req.body);
                console.log('Usuario creado: ', newUser);
                const {username, role} = newUser
                res.status(201).json({username, role});
            }catch(err){
                console.log('Error al crear usuario: ', err);
                res.status(500).json({message:'Error interno del servidor', 
                    success: 'NOK', 
                    error: err.message})
            }
        },
    ],
    getUserById:[
        ...getUserByIdValidation,
        async(req, res) => {
            try{
                const {id} = req.params;
                const user = await getUserByid(id);
                res.status(200).json(user);
            }catch(err){
                console.log('Error al obtener el usuario por ID', err);
                res.status(500).json({message: 'Error al obtener usuario por ID'})
            }
        },
    ],
    getUserByUsernameOrEmail:[
        ...getUserByIdentifierValidation,
        async(req, res) => {
            try{
                const {identifier} = req.params;
                const result = await getUserByUsernameOrEmail(identifier);
                res.status(200).json(result);
            }catch(err){
                res.status(401).json({message: 'Error al encontrar usuario por identifier'})
            }
        },
    ],
    loginUser:[
        ...loginValidation,
        async(req, res) => {
            try{
                const {identifier, password} = req.body;
                const result = await loginUser(identifier, password);
                res.status(200).json(result);
            }catch(err){
                res.status(401).json({message: 'Error al logearte'})
            }
        },
    ],
    logoutUser: [
        async (req, res) => {
        try {
          res.cookie('token', '', { 
            expires: new Date(0), 
            httpOnly: true, 
            path: '/' 
          });
          res.status(200).json({ message: 'Sesión cerrada correctamente' });
        } catch (error) {
          console.error('Error de logout:', error);
          res.status(500).json({ message: 'Error interno del servidor', success: 'NOK', error: error.message });
        }
      },
    ]
}
module.exports = userController;