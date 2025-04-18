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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errMiddleware_1 = __importDefault(require("../errors/errMiddleware"));
const appError_1 = __importDefault(require("../errors/appError"));
const secretKey = process.env.SECRET_KEY || "defaultSecretKey";
exports.authenticateToken = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        const error = new appError_1.default("Access Denied", 403);
        next(error);
    }
    if (token) {
        jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
            if (err) {
                const error = new appError_1.default("Invalid Token", 403);
                next(error);
            }
            req.user = user;
            next();
        });
    }
}));
