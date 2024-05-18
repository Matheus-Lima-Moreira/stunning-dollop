import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const routes = Router();

routes.use(authRoutes);
routes.use(userRoutes);

export default routes;