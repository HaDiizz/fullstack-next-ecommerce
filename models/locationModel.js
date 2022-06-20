import mongoose from "mongoose";

const LocationsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

let Dataset =
  mongoose.models.location || mongoose.model("location", LocationsSchema);

export default Dataset;
