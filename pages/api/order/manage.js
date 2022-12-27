import connectDB from "../../../utils/connectDB";
import Shop from "../../../models/shopModel";
import auth from "../../../middleware/auth";
import Order from "../../../models/orderModel";
import Product from "../../../models/productModel";
import shopOwner from "../../../middleware/shop";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOrder(req, res);
      break;
    case "GET":
      await getOrders(req, res);
      break;
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await auth(req, res);
    let orders;
    if (result.role === "seller") {
      const shop = await shopOwner(req, res);
      orders = await Order.find({ shop: shop.id }).populate(
        "user",
        "-password"
      );
    } else if (result.role === "admin") {
      orders = await Order.find().populate("user", "-password");
    }
    res.json({ orders });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
