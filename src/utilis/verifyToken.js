import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {

    const token = authHeader.split(" ")[1]
    // console.log(token)
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
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        status: "error",
        message: "Invalid Token",
      });
    }
  });
};
