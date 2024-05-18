import { Router } from "express";
import * as UserController from "../controllers/UserController";
import isAuth from "../middlewares/isAuth";

const userRoutes = Router();

userRoutes.get("/users", isAuth, UserController.index);
userRoutes.get("/users/:id", isAuth, UserController.show);
userRoutes.post("/users", isAuth, UserController.store);
userRoutes.put("/users/:id", isAuth, UserController.update);
userRoutes.delete("/users/:id", isAuth, UserController.destroy);

export default userRoutes;