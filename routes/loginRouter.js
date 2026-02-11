import { Router } from "express";
import { login } from "../controllers/loginControllers.js";

const router = Router();

router.post("/", login);

export default router;