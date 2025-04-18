import express from "express";
import {
  createAProduct,
  getProducts,
  getAproduct,
  updateAProduct,
  deleteAProduct,
} from "./productController";

const router = express.Router();



router.post("/product", createAProduct);

router.get("/products", getProducts);

router.get("/products/:id", getAproduct);

router.patch("/products/:id", updateAProduct);

router.delete("/products/:id", deleteAProduct);

export default router
