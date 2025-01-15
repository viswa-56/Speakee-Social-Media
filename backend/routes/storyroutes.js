import express from "express"
import { isAuth } from "../middleware/isauth.js"
import uploadFile from "../middleware/multer.js"
import { deleteStory, getAllStories, newStory } from "../controllers/storyController.js"


const router = express.Router()

router.post("/new",isAuth,uploadFile,newStory)
router.delete("/:id",isAuth,deleteStory)
router.get("/all",isAuth,getAllStories)

export default router