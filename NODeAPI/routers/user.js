import express from "express"
import { getAllUsers, getuserdetails, register, special} from "../controllers/user.js";

const router=express.Router();

router.get("/users/all",getAllUsers)
router.post("/users/new",register)
router.get("/userid/special", special)
router.get("/userid/:userID",getuserdetails)

export default router