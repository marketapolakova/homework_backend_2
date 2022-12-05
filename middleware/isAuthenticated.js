const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ status: "error", errors: ["unauthorized"] });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ status: "error", errors: [err] });
    console.log(user);

    req.user = user;
    next();
  });
};

module.exports = isAuthenticated;
