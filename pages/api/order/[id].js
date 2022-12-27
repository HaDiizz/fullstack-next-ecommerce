import connectDB from "../../../utils/connectDB";
import Shop from "../../../models/shopModel";
import auth from "../../../middleware/auth";
import Order from "../../../models/orderModel";
import Product from "../../../models/productModel";
import shopOwner from "../../../middleware/shop";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateOrder(req, res);
      break;
    case "GET":
      await getOrders(req, res);
      break;
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await auth(req, res);
    const shop = await shopOwner(req, res);
    let orders;
    if (result.role === "admin") {
      orders = await Order.find().populate("user", "-password");
    } else if (result.role === "seller") {
      orders = await Order.find({ shop: shop.id }).populate(
        "user",
        "-password"
      );
    } else {
      orders = await Order.find({ user: result.id }).populate(
        "user",
        "-password"
      );
    }

    res.json({ orders });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const { status } = req.body;

      await Order.findOneAndUpdate({_id: id}, {
        status
    })

    res.json({msg: 'อัพเดทสถานะสำเร็จ'})

  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
