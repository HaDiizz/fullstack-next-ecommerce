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
      orders = await Order.find({ user: result.id }).populate(
        "user",
        "-password"
      );

    res.json({ orders });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { time, tel, cart, total, note } = req.body;

    const newOrder = new Order({
      user: result.id,
      shop: cart[0].shop,
      time,
      tel,
      cart,
      total,
      note,
    });

    await newOrder.save();

    res.json({
      newOrder,
      msg: "สร้างรายการสั่งซื้อเรียบร้อยแล้ว กรุณารอการชำระเงิน",
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
