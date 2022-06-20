import connectDB from "../../../utils/connectDB";
import Shops from "../../../models/shopModel";
import auth from "../../../middleware/auth";
import Users from "../../../models/userModel";
import CryptoJS from "crypto-js";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getReqShop(req, res);
      break;
  }
};

const getReqShop = async (req, res) => {
  try {
    const result = await auth(req, res);

    let shops;
    if (result.role !== "admin") {
      shops = await Shops.find({ user: result.id }).populate(
        "user",
        "-password"
      );
    } 
    else {
      shops = await Shops.find().populate("user", "-password");
    }

    // console.log(JSON.stringify(shops));
    // console.log(public_key);

    res.json({
      shops,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
