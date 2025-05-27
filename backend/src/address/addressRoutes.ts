import  express  from "express";
import { addAddress, getAddresses, updateAddress, deleteAddress} from "./addressController";
import { authenticateToken } from "../users/userAuthMiddleware";

const router = express.Router();

router.use(authenticateToken)

router.post("/addresses", addAddress);

router.get("/addresses", getAddresses);

router.patch("/addresses/:id", updateAddress)

router.delete("/addresses/:id", deleteAddress)

export default router;