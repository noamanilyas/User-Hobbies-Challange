import { Request, Response } from "express";
import * as Joi from "joi";
import { JoiObjectId } from "../common/joi-object-validator.function";
import NotFoundError from "../core/error/notFound.error";
import ValidationError from "../core/error/validation.error";
import { errorResponse, successResponse } from "../core/handlers/api-response.handler";
import { Hobbies } from "../models/hobbies.model";
import { User } from "../models/users.model";

export async function getUserHobbies(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const schema = JoiObjectId().required();
    const { error } = schema.validate(userId);

    if (error) {
      throw new ValidationError("Invalid request, Some parameters are missing or incorrect.");
    }

    const user = await User.findById(userId);

    if (!user) {
      successResponse(res, []);
    }

    const hobbies = await Hobbies.find({ _id: { $in: user.hobbies } });

    const response = hobbies.map((item) => ({
      id: item._id,
      name: item.name,
      passionLevel: item.passionLevel,
      year: item.year,
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
      userId: JoiObjectId().required(),
      name: Joi.string().required(),
      passionLevel: Joi.string().required().valid("Low", "Medium", "High", "Very-High"),
      year: Joi.number().required(),
    });
    const { error } = schema.validate(body);
    if (error) {
      throw new ValidationError("Invalid request, Some parameters are missing or incorrect.");
    }

    const result = await Hobbies.create({
      name: body.name,
      passionLevel: body.passionLevel,
      year: body.year,
    });

    if (!result) {
      throw new Error("Document create failed");
    }

    await User.updateOne(
      { _id: body.userId },
      {
        $push: {
          hobbies: result._id,
        },
      }
    );

    const response = {
      id: result._id,
      name: result.name,
      passionLevel: result.passionLevel,
      year: result.year,
    };

    successResponse(res, response);
  } catch (err) {
    errorResponse(res, err);
  }
}

export async function deleteHobby(req: Request, res: Response) {
  try {
    const { body } = req;

    const schema = Joi.object().keys({
      userId: JoiObjectId().required(),
      hobbyId: JoiObjectId().required(),
    });
    const { error } = schema.validate(body);

    if (error) {
      throw new ValidationError("Invalid request, Some parameters are missing or incorrect.");
    }

    const hobby = await Hobbies.findById(body.hobbyId);

    if (!hobby) {
      throw new NotFoundError("Hobby not found");
    }

    await Hobbies.deleteOne({ _id: body.hobbyId });

    await User.updateOne(
      { _id: body.userId },
      {
        $pull: {
          hobbies: body.hobbyId,
        },
      }
    );

    successResponse(res, {});
  } catch (err) {
    errorResponse(res, err);
  }
}
