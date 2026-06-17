const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    next();
  } catch (err) {
    const issues = err.errors || err.issues;
    if (issues && Array.isArray(issues)) {
      return res.status(400).json({
        message: "Validation error",
        errors: issues.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    return res.status(400).json({ message: "Validation error", error: err.message });
  }
};

module.exports = { validate };
