import express from "express";

import * as userController from "../controllers/users.controller";

export const userRoute = express.Router();

userRoute.get("/user", userController.getAll);
userRoute.post("/user", userController.create);
