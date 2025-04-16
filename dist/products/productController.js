"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAProduct = exports.updateAProduct = exports.getAproduct = exports.getProducts = exports.createAProduct = void 0;
const errMiddleware_1 = __importDefault(require("../errors/errMiddleware"));
const productService_1 = require("./productService");
const appError_1 = __importDefault(require("../errors/appError"));
exports.createAProduct = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description } = req.body;
    const newProduct = yield (0, productService_1.createProduct)(name, price, description);
    if (!newProduct) {
        const error = new appError_1.default("Something wnet wrong", 500);
        next(error);
    }
    res.status(201).json({ Message: "New Product Created", newProduct });
}));
exports.getProducts = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productList = yield (0, productService_1.getAllProducts)();
    if (!productList) {
        const error = new appError_1.default("Something went wrong", 500);
        next(error);
    }
    res.status(201).json(productList);
}));
exports.getAproduct = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const product = yield (0, productService_1.getProductByName)(name);
    if (!product) {
        const error = new appError_1.default("Product not found", 404);
        next(error);
    }
    res.status(201).json(product);
}));
exports.updateAProduct = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, price, description, reviews, ratings } = req.body;
    const updatedProduct = yield (0, productService_1.updateProduct)(id, name, price, description, reviews, ratings);
    if (!updatedProduct) {
        const error = new appError_1.default("Unable to update product", 500);
        next(error);
    }
    res.status(201).json(updatedProduct);
}));
exports.deleteAProduct = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const deletedProduct = yield (0, productService_1.deleteProduct)(id);
    if (!deletedProduct) {
        const error = new appError_1.default("Product not found", 404);
        next(error);
    }
    res.status(201).json({ Message: "Product deleted", deletedProduct });
}));
