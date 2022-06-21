import connectDB from "../../../utils/connectDB";
import Product from "../../../models/productModel";
import auth from "../../../middleware/auth";
import Shop from "../../../models/shopModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProducts(req, res);
      break;
    case "POST":
      await createProducts(req, res);
      break;
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid." });

    const shop = await Shop.findOne({ user: result.id });

    const products = await Product.find({ shop: shop._id });

    if (!products) return res.status(400).json({ err: "Product does not exits." });

    res.json({ products });

  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createProducts = async (req, res) => {
  try {
    const result = await auth(req, res);
    const shop = await Shop.findOne({ user: result.id });

    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { title, price, inStock, content, category, images } = req.body;

    if (
      !title ||
      !price ||
      !inStock ||
      !content ||
      category === "all" ||
      images.length === 0
    )
      return res.status(400).json({ err: "Input can not be blank." });

    const newProduct = new Product({
      shop: shop._id,
      title: title.toLowerCase(),
      price,
      inStock,
      content,
      category,
      images,
    });

    await newProduct.save();

    res.json({ msg: "สร้างสินค้าสำเร็จ", newProduct });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
