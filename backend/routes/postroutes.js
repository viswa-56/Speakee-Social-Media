import express from "express"
import { isAuth } from "../middleware/isauth.js"
import { commentOnPost, deleteComment, deletePost, editCaption, getAllposts, likeUnlikePost, newPost } from "../controllers/postController.js"
import uploadFile from "../middleware/multer.js"

const router = express.Router()

router.post("/new",isAuth,uploadFile,newPost)
router.delete("/:id",isAuth,deletePost)
router.put("/:id",isAuth,editCaption)
router.get("/all",isAuth,getAllposts)
router.post("/like/:id",isAuth,likeUnlikePost)
router.post("/comment/:id",isAuth,commentOnPost)
router.delete("/comment/:id",isAuth,deleteComment)


export default router