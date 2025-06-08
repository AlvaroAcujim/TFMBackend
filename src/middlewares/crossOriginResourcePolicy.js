const setCORPHeader = (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
};

module.exports = setCORPHeader;