import express from "express";
import {
  createAProduct,
  getProducts,
  getAproduct,
  updateAProduct,
  deleteAProduct,
} from "./productController";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Product routes working");
});

router.post("/create", (req, res, next) => {
  console.log("Create route hit"); // <-- does this show up?
  next();
}, createAProduct);

router.get("/allProducts", getProducts);

router.get("/product/:name", getAproduct);

router.put("/update/:id", updateAProduct);

router.delete("/delete/:id", deleteAProduct);

export default router
