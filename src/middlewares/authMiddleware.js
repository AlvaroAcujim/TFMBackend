const jwt = require('jsonwebtoken');
const config = require('../../config');
const SECRET_KEY = config.SECRET_KEY;

const verifyToken = (rolesPermitidos = []) => (req, res, next) => {
  //la segunda parte del token es para probar el token con el header unicamente y usar thunder
  let token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No se proporciono token' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    if (rolesPermitidos.length > 0 && (!req.user || !rolesPermitidos.includes(req.user.role))) {
      return res.status(403).json({ message: 'No tienes permiso para esta accion' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalido' });
  }
};


module.exports = { verifyToken };