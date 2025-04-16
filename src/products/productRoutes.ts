import express from "express";
import {
  createAProduct,
  getProducts,
  getAproduct,
  updateAProduct,
  deleteAProduct,
} from "./productController";

const router = express.Router();



router.post("/create", createAProduct);

router.get("/allProducts", getProducts);

router.get("/product/:name", getAproduct);

router.put("/update/:id", updateAProduct);

router.delete("/delete/:id", deleteAProduct);

export default router
