import { Router } from "express";
import * as userService from "./users.serviece.js";
import { authentication } from "../../Middlewares/authentication.middlewares.js";

const router = Router();

router.get("/getProfile", authentication, userService.getSingleUser);

export default router;
