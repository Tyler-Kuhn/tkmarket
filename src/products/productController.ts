import { Request, Response, NextFunction } from "express";
import catchFunction from "../errors/errMiddleware";

import {
  createProduct,
  getAllProducts,
  getProductByName,
  updateProduct,
  deleteProduct,
} from "./productService";
import AppError from "../errors/appError";

export const createAProduct = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description } = req.body;

    const newProduct = await createProduct(name, price, description);

    if (!newProduct) {
      const error = new AppError("Something wnet wrong", 500);
      next(error);
    }

    res.status(201).json({ Message: "New Product Created", newProduct });
  }
);

export const getProducts = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const productList = await getAllProducts();

    if (!productList) {
      const error = new AppError("Something went wrong", 500);
      next(error);
    }

    res.status(201).json(productList);
  }
);

export const getAproduct = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const product = await getProductByName(name);

    if (!product) {
      const error = new AppError("Product not found", 404);
      next(error);
    }

    res.status(201).json(product);
  }
);

export const updateAProduct = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, name, price, description, reviews, ratings } = req.body;

    const updatedProduct = await updateProduct(
      id,
      name,
      price,
      description,
      reviews,
      ratings
    );

    if (!updatedProduct) {
      const error = new AppError("Unable to update product", 500);
      next(error);
    }

    res.status(201).json(updatedProduct)
  }
);

export const deleteAProduct = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.body;

    const deletedProduct = await deleteProduct(id);

    if(!deletedProduct){
        const error = new AppError("Product not found", 404);
      next(error);
    }

    res.status(201).json({Message: "Product deleted", deletedProduct})
  }
);
