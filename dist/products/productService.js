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
exports.deleteProduct = exports.updateProduct = exports.getProductByName = exports.getAllProducts = exports.createProduct = void 0;
const db_1 = __importDefault(require("../config/db"));
const appError_1 = __importDefault(require("../errors/appError"));
const createProduct = (name, price, description) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = yield db_1.default.product.create({
        data: { name, price, description },
    });
    if (!newProduct) {
        throw new appError_1.default("Somthing went wrong", 500);
    }
    return newProduct;
});
exports.createProduct = createProduct;
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const allProducts = yield db_1.default.product.findMany();
    if (!allProducts) {
        throw new appError_1.default("Something went wrong", 500);
    }
    return allProducts;
});
exports.getAllProducts = getAllProducts;
const getProductByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.default.product.findMany({
        where: { name },
    });
    return product;
});
exports.getProductByName = getProductByName;
const updateProduct = (id, name, price, description, reviews, ratings) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProduct = yield db_1.default.product.update({
        where: { id: parseInt(id) },
        data: { name, price, description, reviews, ratings },
    });
    return updatedProduct;
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProduct = yield db_1.default.product.delete({
        where: { id: parseInt(id) },
    });
    return deletedProduct;
});
exports.deleteProduct = deleteProduct;
