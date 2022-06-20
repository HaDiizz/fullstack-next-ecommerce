import connectDB from "../../../utils/connectDB";
import Product from "../../../models/productModel";
import auth from "../../../middleware/auth";
import Shop from "../../../models/shopModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "POST":
      await createProducts(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.query;
    // const shop = await Shop.findById(id)
    const product = await Product.find({ shop: id });

    if (!product)
      return res.status(400).json({ err: "This product does not exists." });

    res.json({ product });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createProducts = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { title, price, inStock, content, category, images } = req.body;
    const { id } = req.query;

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
      shop: id,
      title: title.toLowerCase(),
      price,
      inStock,
      content,
      category,
      images,
    });

    await newProduct.save();

    res.json({ msg: "Success! Created a product.", newProduct });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

//Delete product
const deleteProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await Product.findByIdAndDelete(id);
    res.json({ msg: "Deleted a product." });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
