"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthController_1 = require("./userAuthController");
const userAuthMiddleware_1 = require("./userAuthMiddleware");
const router = express_1.default.Router();
router.post("/register", userAuthController_1.register);
router.post("/login", userAuthController_1.login);
router.get("/user", userAuthMiddleware_1.authenticateToken, userAuthController_1.getUser);
router.put("/user", userAuthMiddleware_1.authenticateToken, userAuthController_1.updateUser);
exports.default = router;
