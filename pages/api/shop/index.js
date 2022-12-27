import connectDB from "../../../utils/connectDB";
import Shops from "../../../models/shopModel";
import auth from "../../../middleware/auth";
import bcrypt from "bcrypt";
import Shop from "../../../models/shopModel";
import shopOwner from "../../../middleware/shop";
import CryptoJS from "crypto-js";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getShops(req, res);
      break;
    case "POST":
      await createShop(req, res);
      break;
    case "PATCH":
      await uploadInfor(req, res);
      break;
  }
};

const createShop = async (req, res) => {
  try {
    const result = await auth(req, res);

    //FIX1
    if (result.role === "seller")
      return res
        .status(400)
        .json({ err: "คุณมีสิทธิ์ในการสร้างร้านแค่ครั้งเดียวเท่านั้น" });

    const {
      shopName,
      contact,
      detail,
      location,
      isChecked,
      image,
      public_key,
      secret_key,
    } = req.body;

    const shopValidate = await Shop.findOne({ user: result.id });

    if (shopValidate) {
      return res
        .status(400)
        .json({ err: "คุณมีสิทธิ์ในการสร้างร้านแค่ครั้งเดียวเท่านั้น" });
    }

    if (!shopName || !contact || !detail || !location === "all" || !image)
      return res.status(400).json({ err: "กรุณากรอกข้อมูลให้ครบถ้วน" });

    var publicKeyHash = CryptoJS.AES.encrypt(
      public_key,
      process.env.CRYPTO_PUBLIC
    ).toString();
    var secretKeyHash = CryptoJS.AES.encrypt(
      secret_key,
      process.env.CRYPTO_SECRET
    ).toString();

    const newShop = new Shops({
      user: result.id,
      shopName: shopName.toLowerCase(),
      contact,
      detail,
      location,
      isHalal: isChecked,
      logo: image,
      public_key: public_key === "" ? public_key : publicKeyHash,
      secret_key: secret_key === "" ? secret_key : secretKeyHash,
    });

    await newShop.save();
    res.json({
      newShop,
      msg: "สร้างร้านค้าสำเร็จ รอการอนุมัติจากผู้ดูแลระบบ",
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getShops = async (req, res) => {
  try {
    const shops = await Shops.find()
      .select("-secret_key")
      .select("-public_key");

    return res.json({
      shops,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
