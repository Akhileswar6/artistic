const sanitizeNoSql = (data) => {
  if (data && typeof data === 'object') {
    for (const key in data) {
      if (key.startsWith('$') || key.includes('.')) {
        delete data[key];
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        sanitizeNoSql(data[key]);
      }
    }
  }
};

const mongoSanitizer = (req, res, next) => {
  if (req.body) sanitizeNoSql(req.body);
  if (req.query) sanitizeNoSql(req.query);
  if (req.params) sanitizeNoSql(req.params);
  next();
};

module.exports = mongoSanitizer;
