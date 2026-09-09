import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, enum: ["running", "court", "lifestyle"], required: true },
  price: { type: Number, required: true },
  sizes: [{ type: Number }],
  colors: [{ type: String }],
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  description: { type: String },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);