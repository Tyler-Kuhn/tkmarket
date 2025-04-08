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
exports.getUser = exports.login = exports.register = void 0;
const errMiddleware_1 = __importDefault(require("../errors/errMiddleware"));
const appError_1 = __importDefault(require("../errors/appError"));
const userAuthServices_1 = require("./userAuthServices");
exports.register = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Incoming request:", req.body);
    const { name, email, password } = req.body;
    const newUser = yield (0, userAuthServices_1.registerUser)(name, email, password);
    if (!newUser) {
        const error = new appError_1.default("Something went wrong", 500);
        next(error);
    }
    res.status(201).json(newUser);
}));
exports.login = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const token = yield (0, userAuthServices_1.loginUser)(email, password);
    if (!token) {
        const error = new appError_1.default("Invalid email or password", 400);
        next(error);
    }
    res.json({ token });
}));
exports.getUser = (0, errMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const user = yield (0, userAuthServices_1.getUserById)(userId);
    if (!user) {
        const error = new appError_1.default("User not found", 404);
    }
    res.json(user);
}));
