import  express  from "express";
import { addAddress, getAddresses, updateAddress, deleteAddress} from "./addressController";

const router = express.Router();


router.post("/addresses", addAddress);

router.get("/addresses", getAddresses);

router.patch("/addresses/:id", updateAddress)

router.delete("/addresses/:id", deleteAddress)

export default router;