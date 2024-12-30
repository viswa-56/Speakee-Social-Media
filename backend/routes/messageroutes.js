import express from "express"
import { isAuth } from "../middleware/isauth.js"
import { getAllChats, getAllMessages, sendMessage } from "../controllers/messageController.js"

const router = express.Router()

router.post("/",isAuth,sendMessage)
router.get("/chats",isAuth,getAllChats)
router.get("/:id",isAuth,getAllMessages)

export default router