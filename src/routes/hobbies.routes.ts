import express from "express";

import * as hobbiesController from "../controllers/hobbies.controller";

export const hobbiesRoute = express.Router();

hobbiesRoute.get("/hobbies/:userId", hobbiesController.getUserHobbies);
hobbiesRoute.post("/hobbies", hobbiesController.create);
hobbiesRoute.delete("/hobbies", hobbiesController.deleteHobby);
