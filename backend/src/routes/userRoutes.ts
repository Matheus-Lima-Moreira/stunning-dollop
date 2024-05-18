import { Router } from "express";
import * as UserController from "../controllers/UserController";

const userRoutes = Router();

userRoutes.get("/users", UserController.index);
userRoutes.get("/users/:id", UserController.show);
userRoutes.post("/users", UserController.store);
userRoutes.put("/users/:id", UserController.update);
userRoutes.delete("/users/:id", UserController.destroy);

export default userRoutes;