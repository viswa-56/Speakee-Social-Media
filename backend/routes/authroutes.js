import express from "express"
import uploadFile from "../middleware/multer.js"
import { userLogin, userLogout, userRegister } from "../controllers/authController.js"

const router = express.Router()

router.post("/register",uploadFile,userRegister);
router.post("/login",userLogin);
router.get("/logout",userLogout);


export default router