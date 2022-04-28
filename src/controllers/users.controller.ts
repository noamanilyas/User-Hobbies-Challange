import { Request, Response } from "express";
import * as Joi from "joi";
import ValidationError from "../core/error/validation.error";
import { errorResponse, successResponse } from "../core/handlers/api-response.handler";
import { User } from "../models/users.model";

export async function getAll(req: Request, res: Response) {
  try {
    const users = await User.find();

    const response = users.map((item) => ({
      id: item._id,
      name: item.name,
    }));

    successResponse(res, response);
  } catch (err) {
    errorResponse(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { body } = req;

    const schema = Joi.object().keys({
      name: Joi.string().required(),
    });
    const { error } = schema.validate(body);
    if (error) {
      throw new ValidationError("Invalid request, Some parameters are missing or incorrect.");
    }

    const document = {
      name: body.name,
      hobbies: [],
    };

    const user = await User.create(document);

    if (!user) {
      throw new Error("Users not created");
    }

    const response = {
      id: user._id,
      name: user.name,
    };

    successResponse(res, response);
  } catch (err) {
    errorResponse(res, err);
  }
}
