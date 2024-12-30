import express from "express"
import { isAuth } from "../middleware/isauth.js"
import uploadFile from "../middleware/multer.js"
import { getAllUsers, myprofile, updatePassword, updateProfile, userFollowerandFollowingsData, userFollowUnfollow, userProfile } from "../controllers/userController.js"

const router = express.Router()

router.get('/me',isAuth,myprofile)
router.get('/all',isAuth,getAllUsers)
router.get('/:id',isAuth,userProfile)
router.post('/:id',isAuth,updatePassword)
router.put('/:id',isAuth,uploadFile,updateProfile)
router.post('/follow/:id',isAuth,userFollowUnfollow)
router.get('/followdata/:id',isAuth,userFollowerandFollowingsData)

export default router 