import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import IUser from "../interface/user";

const isAuthenticated: RequestHandler = (req: Request, res, next) => {
  const authHeader: string | undefined = req.headers["authorization"];
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

export default isAuthenticated;
