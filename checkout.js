import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/checkout
// body: { items: [{ name, price, quantity }], userId, shippingAddress }
router.post("/", async (req, res) => {
  try {
    const { items, userId, shippingAddress } = req.body;

    const line_items = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`
    });

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await Order.create({
      user: userId,
      items,
      total,
      shippingAddress,
      status: "pending",
      stripeSessionId: session.id
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;