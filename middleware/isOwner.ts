import ShoppingList from "../model/ShoppingList";
import { Request, Response, NextFunction, RequestHandler } from "express";
import IShoppingList from "../interface/shoppingList";
import ErrorResponse from "../utils/errorResponse";

const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.foundUser._id;

  ShoppingList.findById(
    req.params.listid,
    (err: Error | undefined, list: IShoppingList) => {
      if (err) return res.status(400).json(new ErrorResponse("error", [err]));
      if (!list)
        return res
          .status(404)
          .json(new ErrorResponse("error", ["no shopping list with given id"]));
      console.log(list.owner.toString());

      if (list.owner.toString() === userId) {
        next();
      } else {
        res.status(401).json(new ErrorResponse("error", ["unauthorized"]));
      }
    }
  );
};

export default isOwner;
