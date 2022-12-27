import Shops from "../models/shopModel";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";

const shop = async (req, res) => {
  const token = req.headers.authorization; //get token user
  if (!token) return res.status(400).json({ err: "Invalid Authentication" });

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); //verify token and get id user /get by Token

  if (!decoded) return res.status(400).json({ err: "Invalid Authentication" });

  const user = await Users.findOne({ _id: decoded.id }); //find same id
  const shopSeller = await Shops.findOne({ user: user._id });

  return {
    id: shopSeller._id,
  };
};

export default shop;
