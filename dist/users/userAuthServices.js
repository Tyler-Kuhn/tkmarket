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
exports.updateUserById = exports.getUserById = exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../errors/appError"));
const secretKey = process.env.SECRET_KEY || "defaultSecretKey";
const saltRounds = 10;
const registerUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    const newUser = yield db_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
    if (!newUser) {
        throw new appError_1.default("Something went wrong", 500);
    }
    const user = yield db_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new appError_1.default("Invalid Email", 400);
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    return token;
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new appError_1.default("Invalid Email", 400);
    }
    const validPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!validPassword) {
        throw new appError_1.default("Invalid password", 400);
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    return token;
});
exports.loginUser = loginUser;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
    });
});
exports.getUserById = getUserById;
const updateUserById = (userId, name, email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.user.update({
        where: { id: userId },
        data: { name, email },
    });
});
exports.updateUserById = updateUserById;
