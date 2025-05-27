import { Request, Response, NextFunction } from "express";
import catchFunction from "../errors/errMiddleware";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./productService";
import AppError from "../errors/appError";

export const createAProduct = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const { name, price, description } = req.body;

    if (!name || !price || !description){
      const error = new AppError("Missing required fields", 400);
      next(error);
    }

    const newProduct = await createProduct(name, price, description);


    res.status(201).json({ Message: "New Product Created", newProduct });
  }
);

export const getProducts = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const productList = await getAllProducts();

    res.status(200).json(productList);
  }
);

export const getAproduct = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await getProductById(parseInt(id));

    if (!product) {
      const error = new AppError("Product not found", 404);
      next(error);
    }

    res.status(200).json(product);
  }
);

export const updateAProduct = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, price, description, reviews, ratings } = req.body;

    if(!id){
      const error = new AppError("Missing product ID", 400);
      next(error);
    }

    const updatedProduct = await updateProduct(
      parseInt(id),
      name,
      price,
      description,
      reviews,
      ratings
    );

    res.status(201).json(updatedProduct)
  }
);

export const deleteAProduct = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    if(!id){
      const error = new AppError("Missing product ID", 400);
      next(error);
    }

    const deletedProduct = await deleteProduct(parseInt(id));

    res.status(200).json({Message: "Product deleted", deletedProduct})
  }
);
