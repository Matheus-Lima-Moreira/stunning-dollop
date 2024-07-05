import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import roleRoutes from "./roleRoutes";

const routes = Router();

routes.use(authRoutes);
routes.use(userRoutes);
routes.use(roleRoutes);

export default routes;