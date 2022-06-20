import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Anonymous",
    },
    detail: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    images: Array,
    status: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

let Dataset =
  mongoose.models.services || mongoose.model("services", ServiceSchema);

export default Dataset;
