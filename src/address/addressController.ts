import { Request, Response, NextFunction } from "express";
import catchFunction from "../errors/errMiddleware";
import AppError from "../errors/appError";
import { createAddress, getUserAddresses, updateUserAddress,deleteUserAddress } from "./addressServices";

export const addAddress = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.userId;
    

    if(!userId){
        const error = new AppError("Must be logged in",  403);
        next(error);
    }

    const {street, city, state, zip, country, type} = req.body;

    if(!street || !city || !state || !zip || !country || !type){
        const error = new AppError("Missing required fields", 400);
        next(error);
    }

    const addressInfo = {street, city, state, zip, country, type};

    await createAddress(parseInt(userId), addressInfo);

    res.status(201).json("New Addess Created")
  }
);

export const getAddresses = catchFunction(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user.userId;

        if(!userId){
            const error = new AppError("Must be logged in",  403);
            next(error);
        }

        const userAddresses = await getUserAddresses(parseInt(userId));

        res.status(200).json(userAddresses);
    }
)

export const updateAddress = catchFunction(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user.userId;

        if(!userId){
            const error = new AppError("Must be logged in",  403);
            next(error);
        }

        const addressId = req.params.id

        const {street, city, state, zip, country, type} = req.body;

        await updateUserAddress(parseInt(userId), parseInt(addressId), street, city, state, zip, country, type )

        res.status(200).json("Address Updated");
    }
)

export const deleteAddress = catchFunction(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user.userId;

        if(!userId){
            const error = new AppError("Must be logged in",  403);
            next(error);
        }

        const addressId = req.params.id


        await deleteUserAddress(parseInt(userId), parseInt(addressId));

        res.status(200).json("Address Deleted")
    }
)
