import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
}, { timestamps: true });

const Image = mongoose.model("Image", imageSchema);
export default Image;