"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("./productController");
const router = express_1.default.Router();
router.post("/create", productController_1.createAProduct);
router.get("/allProducts", productController_1.getProducts);
router.get("/product/:name", productController_1.getAproduct);
router.put("/update/:id", productController_1.updateAProduct);
router.delete("/delete/:id", productController_1.deleteAProduct);
exports.default = router;
