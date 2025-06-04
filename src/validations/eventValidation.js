const {body, param, validationResult} = require('express-validator');

const validateResult = (req,res,next) => {
    const error = validateResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }
    next();
}

const createEventValidation = [
    body('title')
           .notEmpty()
           .withMessage('El titulo es requerido')
           .isString()
           .withMessage('El titulo debe ser texto'),
       body('description')
           .notEmpty()
           .withMessage('La descripcion es requerida')
           .isString()
           .withMessage('La descripcion debe ser texto'),
       body('date')
           .notEmpty()
           .withMessage('La fecha es requerida')
           .isISO8601()
            .toDate() 
            .withMessage('La fecha debe estar en formato válido (ISO 8601)'),

           validateResult
];
const removeEventValidation = [
    param('eventId')
            .isMongoId()
            .withMessage('El id del task no es valido'),
            validateResult
];
const updateEventValidation = [
    param('eventId')
        .isMongoId()
        .withMessage('El id del task no es valido'),
    body('title')
        .notEmpty()
        .withMessage('El titulo es requerido')
        .isString()
        .withMessage('El titulo debe ser texto'),
    body('description')
        .notEmpty()
        .withMessage('La descripcion es requerida')
        .isString()
        .withMessage('La descripcion debe ser texto'),
    body('date')
        .notEmpty()
        .withMessage('La fecha es requerida')
        .isISO8601()
        .toDate() 
        .withMessage('La fecha debe estar en formato válido (ISO 8601)'),
]

module.exports = {createEventValidation, removeEventValidation, updateEventValidation};

