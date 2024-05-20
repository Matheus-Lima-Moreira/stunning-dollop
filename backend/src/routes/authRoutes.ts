import { Router } from "express";
import * as SessionController from "../controllers/SessionController";
import isAuth from "../middlewares/isAuth";

const authRoutes = Router();

authRoutes.post("/login", SessionController.login);
authRoutes.post("/refresh_token", SessionController.update);
authRoutes.post("/register", SessionController.register);
authRoutes.delete("/logout", isAuth, SessionController.logout);

export default authRoutes;