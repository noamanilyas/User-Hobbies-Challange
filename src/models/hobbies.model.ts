import mongoose from "mongoose";

export const Hobbies = mongoose.model(
  "Hobbies",
  new mongoose.Schema({
    passionLevel: String,
    name: String,
    year: Number,
  })
);
