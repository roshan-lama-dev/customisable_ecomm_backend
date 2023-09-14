import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err)
        res.status(403).json({
          status: "error",
          message: "Token is not valid",
        });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      status: "error",
      message: "You are not verified",
    });
  }
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.idAdmin) {
      next();
    } else {
      res.status(403).json({
        status: "error",
        message: "You are not authorised to perform this action",
      });
    }
  });
};
