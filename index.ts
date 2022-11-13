import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import shoppingListController from "./controller/shoppingListController";
import authController from "./controller/authController";

const app: Express = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/shoppinglist", shoppingListController);
app.use("/api/auth", authController);

mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log(`there was problem connecting to mongo db, reason: ${e}`);
  });

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});
