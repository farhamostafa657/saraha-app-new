import { Router } from "express";
import * as authServiece from "./auth.serviece.js";

const router = Router();

router.post("/signup", authServiece.signUp);
router.post("/login", authServiece.login);
router.post("/social-login", authServiece.loginWithGmail);

export default router;
