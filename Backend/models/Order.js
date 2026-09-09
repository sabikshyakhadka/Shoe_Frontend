import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    size: Number,
    quantity: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" },
  shippingAddress: {
    line1: String,
    city: String,
    postalCode: String,
    country: String
  },
  stripeSessionId: { type: String }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);