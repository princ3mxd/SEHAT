import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    safetyLevel: {
      type: Number,
      enum: [0, 1, 2, 3], // 0: safe, 1: warning (yellow), 2: caution (light red), 3: unsafe (dark red)
      default: 1,
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", LocationSchema);
export default Location;
