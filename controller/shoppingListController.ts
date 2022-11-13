import express, { Request, Response } from "express";
import { CallbackError } from "mongoose";
import IShoppingList from "../interface/shoppingList";

import isAuthenticated from "../middleware/isAuthenticated";
import isOwner from "../middleware/isOwner";
import isOwnerOrContributor from "../middleware/isOwnerOrContributor";
import ShoppingList from "../model/ShoppingList";
import ErrorResponse from "../utils/errorResponse";

const router = express.Router();

// get all lists for user
router.get("/", isAuthenticated, (req: Request, res: Response) => {
  ShoppingList.find(
    { owner: req.user.foundUser._id },
    (err: Error | undefined, lists: Array<IShoppingList>) => {
      if (err) return res.status(400).json({ status: "error", errors: [err] });
      if (lists.length < 1) {
        return res.status(200).json({
          status: "empty",
          errors: [],
          data: "no shopping lists for given user",
        });
      } else {
        return res
          .status(200)
          .json({ status: "success", errors: [], data: req.body });
      }
    }
  );
});

// get list by id
router.get(
  "/:listId",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    const listId = req.params.listId;
    ShoppingList.findById(
      listId,

      (err: Error | undefined, list: IShoppingList | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        }
        if (!list) {
          return res
            .status(404)
            .json(new ErrorResponse("error", ["no list found for given id"]));
        } else {
          return res
            .status(200)
            .json({ status: "success", data: req.body, errors: [] });
        }
      }
    );
  }
);

// create shopping list
router.post("/", isAuthenticated, (req: Request, res: Response) => {
  const body = req.body;
  const _shoppingList = new ShoppingList({
    name: body.name,
    items: body.items,
    owner: req.user.foundUser._id,
    contributors: body.contributors || [],
  });
  _shoppingList.save((err, result) => {
    if (err) {
      return res.status(400).json({ status: "error", errors: [err] });
    } else {
      res.status(201).json({ status: "created", data: req.body, errors: [] });
    }
  });
});

// delete shopping list
router.delete(
  "/:listId",
  isAuthenticated,
  isOwner,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndDelete(
      req.params.listId,
      (err: Error | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res
            .status(200)
            .json({ status: "deleted", errors: [], data: req.params.listId });
        }
      }
    );
  }
);

// update shopping list
router.put(
  "/:listId",
  isAuthenticated,
  isOwner,
  (req: Request, res: Response) => {
    if (!req.body.name)
      return res
        .status(400)
        .json(new ErrorResponse("error", ["new name not filled"]));
    ShoppingList.findByIdAndUpdate(
      req.params.listId,
      req.body,
      { new: true, rawResult: true, runValidators: true },
      (err: Error | undefined | CallbackError) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(200).json({
            status: "updated",
            data: { listId: req.params.listId, body: req.body },
            errors: [],
          });
        }
      }
    );
  }
);

// add item to shopping list
router.post(
  "/:listId/item",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listId,

      {
        $push: { items: req.body },
      },
      { new: true, rawResult: true, runValidators: true },
      (err: Error | undefined | CallbackError) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(200).json({
            status: "updated",
            data: { listId: req.params.listId, body: req.body },
            errors: [],
          });
        }
      }
    );
  }
);

// rename item in shopping list
router.put(
  "/:listId/item/:itemid",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    console.log(req.body);

    ShoppingList.findByIdAndUpdate(
      req.params.listId,

      {
        $set: {
          items: { _id: req.params.itemid, name: req.body.name },
        },
      },
      { new: true, rawResult: true, runValidators: true },
      (err: Error | undefined | CallbackError) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(200).json({
            status: "updated",
            data: { paramas: req.params, body: req.body },
            errors: [],
          });
        }
      }
    );
  }
);

// delete item from shopping list
router.delete(
  "/:listId/item/:itemid",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listId,

      {
        $pull: { items: { _id: req.params.itemid } },
      },
      { new: true, rawResult: true, runValidators: true, upsert: true },
      (err: CallbackError | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(200).json({
            status: "deleted",
            data: { params: req.params },
            errors: [],
          });
        }
      }
    );
  }
);

// check item in shopping list
router.get(
  "/:listId/item/:itemid/mark",
  isAuthenticated,
  isOwnerOrContributor,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listId,

      {
        $set: { items: { _id: req.params.itemid, checked: true } },
      },
      { new: true, rawResult: true, runValidators: true },
      (err: Error | undefined | CallbackError) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(200).json({
            status: "updated",
            data: { params: req.params },
            errors: [],
          });
        }
      }
    );
  }
);

// add contributor
router.post(
  "/:listId/contributor",
  isAuthenticated,
  isOwner,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listId,
      {
        $push: { contributors: req.body },
      },
      { new: true, rawResult: true, runValidators: true },
      (err: Error | undefined | CallbackError) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(204).json({
            status: "updated",
            errors: [],
            data: { params: req.params, body: req.body },
          });
        }
      }
    );
  }
);

// delete contributor
router.delete(
  "/:listId/contributor/:contributorid",
  isAuthenticated,
  isOwner,
  (req: Request, res: Response) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listId,
      {
        $pull: { contributors: { _id: req.params.contributorid } },
      },
      (err: Error | undefined) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(204).json({
            status: "updated",
            errors: [],
            data: { params: req.params },
          });
        }
      }
    );
  }
);
export default router;
