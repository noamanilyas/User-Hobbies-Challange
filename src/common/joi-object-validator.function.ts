import * as Joi from "joi";

export const JoiObjectId = (message = "valid id") => Joi.string().regex(/^[0-9a-fA-F]{24}$/, message);
