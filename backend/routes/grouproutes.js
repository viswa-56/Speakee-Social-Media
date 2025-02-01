import express from "express"
import { isAuth } from "../middleware/isauth.js"
import { createGroup, sendGroupMessage, getGroupMessages,getUserGroups,addMemberToGroup,removeMemberFromGroup ,exitGroup,addAdminToGroup,getAllGroupMembers} from "../controllers/groupController.js"

const router = express.Router()

router.post("/new",isAuth,createGroup)
router.post("/sendmsg",isAuth,sendGroupMessage)
router.get("/allgroups",isAuth,getUserGroups)
router.post("/addmember", isAuth, addMemberToGroup);
router.post("/removemember", isAuth, removeMemberFromGroup);
router.post("/exit", isAuth, exitGroup);
router.post("/addadmin", isAuth, addAdminToGroup);
router.get("/members/:groupId", isAuth, getAllGroupMembers);
router.get("/:id",isAuth,getGroupMessages)

export default router