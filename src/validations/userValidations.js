const {body, param, validationResult} = require('express-validator');

const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

const createUserValidations = [
    body('name')
        .notEmpty()
        .withMessage('El name es requerido')
        .isString()
        .withMessage('El nombre debe ser texto'),
    body('username')
        .notEmpty()
        .withMessage('El username es requerido')
        .isString()
        .withMessage('El username debe ser texto'),
    body('password')
        .notEmpty()
        .withMessage('La password es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'), 
    body('email')
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Debe proporcionar un email válido'),
    body('role')
        .optional()
        .isIn(['admin', 'user'])
        .withMessage('El rol debe ser admin o user'),

    validateResult
];
const getUserByIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Debe ser un ID de MongoDB válido'),

    validateResult
];
const getUserByIdentifierValidation = [
    param('identifier')
    .notEmpty()
    .withMessage('Debes ingresar un email o username')
    .isString()
    .withMessage('El email o el username debe de ser texto'),

    validateResult
];
const loginValidation = [
    body('identifier')
        .notEmpty()
        .withMessage('Debes ingresar un email o username')
        .isString()
        .withMessage('El email o el username debe de ser texto'),
    body('password')
        .notEmpty()
        .withMessage('La password es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateResult
];

module.exports = {createUserValidations, getUserByIdValidation, loginValidation, getUserByIdentifierValidation}