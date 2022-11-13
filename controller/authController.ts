import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User";
import { Model } from "mongoose";
import IUser from "../interface/user";

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
  const body = req.body;
  console.log(req.body);

  if (!(body.username || body.password)) {
    res
      .status(400)
      .json({ status: "error", errors: ["username or password missing"] });
  } else {
    User.findOne(
      { username: body.username },
      (err: Error | undefined, foundUser: IUser | undefined) => {
        if (foundUser) {
          res
            .status(400)
            .json({ status: "error", errors: ["username already exists"] });
        } else if (err) {
          res.status(400).json({ status: "error", errors: [err] });
        } else {
          bcrypt.hash(
            body.password,
            10,
            (err: Error | undefined, hash: string) => {
              if (err) res.status(400).json({ status: "error", errors: [err] });
              const user = new User({
                username: body.username,
                password: hash,
              });
              user.save();
              res
                .status(200)
                .json({ status: "user created", errors: [], data: req.body });
            }
          );
        }
      }
    );
  }
});

router.post("/login", (req: Request, res: Response) => {
  const body = req.body;
  User.findOne(
    { username: body.username },
    (err: Error | undefined, foundUser: IUser | undefined) => {
      if (!foundUser) {
        res.status(400).json({
          status: "error",
          errors: ["username or password incorrect"],
        });
      } else if (err) {
        res.status(400).json({ status: "error", errors: [err] });
      } else {
        bcrypt.compare(
          body.password,
          foundUser.password,
          (err, result: boolean) => {
            if (err) {
              res.status(400).json({ status: "error", errors: [err] });
            } else if (!result) {
              res.status(400).json({
                status: "error",
                errors: ["username or password incorrect"],
              });
            } else {
              res
                .status(200)
                .json({ status: "logged in", errors: [], data: req.body });
            }
          }
        );
      }
    }
  );
});

export default router;
