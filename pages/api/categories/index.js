import connectDB from "../../../utils/connectDB";
import auth from "../../../middleware/auth";
import Categories from "../../../models/categoryModels";
import Shop from "../../../models/shopModel";
import authShop from '../../../middleware/shop';

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createCategories(req, res);
      break;
    case "GET":
      await getCategories(req, res);
      break;
  }
};

const createCategories = async (req, res) => {
  try {
    const result = await auth(req, res);
    const ownShop = await authShop(req, res);
    const shop = await Shop.findOne({ user: result.id }); //find own shop

    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid" });

    const { name } = req.body;

    // console.log(result.id);

    if (!name)
      res.status(400).json({ err: "กรุณากรอกชื่อประเภทสินค้า" });

    const newCategory = new Categories({
      name: name.toLowerCase(),
      shop: shop._id,
    });

    await newCategory.save();

    res.json({
      msg: "สร้างประเภทสินค้าเรียบร้อยแล้ว",
      newCategory,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await auth(req, res);
    const shop = await Shop.findOne({ user: result.id });

    let categories;
    if (result.role !== "admin") {
      categories = await Categories.find({ shop: shop._id })

    } else {
      categories = await Categories.find()
    }

    res.json({ categories });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
