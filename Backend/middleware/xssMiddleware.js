const xss = require("xss");

const clean = (data) => {
  if (typeof data === "string") {
    return xss(data);
  }
  if (Array.isArray(data)) {
    return data.map(clean);
  }
  if (typeof data === "object" && data !== null) {
    const cleaned = {};
    for (const key in data) {
      cleaned[key] = clean(data[key]);
    }
    return cleaned;
  }
  return data;
};

const xssSanitizer = (req, res, next) => {
  if (req.body) req.body = clean(req.body);
  if (req.query) req.query = clean(req.query);
  if (req.params) req.params = clean(req.params);
  next();
};

module.exports = xssSanitizer;
