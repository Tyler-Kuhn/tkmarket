import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import  globalErrorHandler from "./errors/globalErrors";
import prismaErrorHandler from "./errors/prismaErrors";
import userRouter from "./users/userAuthRoutes";
import productsRouter from "./products/productRoutes";


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

app.use(prismaErrorHandler as ErrorRequestHandler);
app.use(globalErrorHandler as unknown as ErrorRequestHandler); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
