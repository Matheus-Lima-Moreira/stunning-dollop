import { Router } from "express";
import * as RoleController from "../controllers/RoleController";
import isAuth from "../middlewares/isAuth";

const roleRoutes = Router();

roleRoutes.get("/roles", isAuth, RoleController.index);
roleRoutes.get("/roles/:id", isAuth, RoleController.show);
roleRoutes.post("/roles", isAuth, RoleController.store);
roleRoutes.put("/roles/:id", isAuth, RoleController.update);
roleRoutes.delete("/roles/:id", isAuth, RoleController.destroy);

export default roleRoutes;