import connectDB from "../../../../utils/connectDB";
import Shop from "../../../../models/shopModel";
import auth from "../../../../middleware/auth";
import Order from "../../../../models/orderModel";
import Product from "../../../../models/productModel";
import shopOwner from "../../../../middleware/shop";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getOrders(req, res);
      break;
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await auth(req, res);
    let orders;

      orders = await Order.find({ user: result.id }).populate(
        "user",
        "-password"
      );

    res.json({ orders });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

