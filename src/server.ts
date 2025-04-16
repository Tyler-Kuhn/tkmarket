import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import userRouter from "./users/userAuthRoutes";
import productsRouter from "./products/productRoutes";
console.log("Product routes loaded");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet()); // Add security-related HTTP headers
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
  })
);

app.use("/products", productsRouter);
app.use("/users", userRouter);


app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
