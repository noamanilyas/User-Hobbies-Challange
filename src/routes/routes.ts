import express from "express";
import { userRoute } from "./users.routes";
import { hobbiesRoute } from "./hobbies.routes";

export const routes = express.Router();

routes.use(userRoute);
routes.use(hobbiesRoute);
