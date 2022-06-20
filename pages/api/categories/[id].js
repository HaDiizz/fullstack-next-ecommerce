import connectDB from "../../../utils/connectDB";
import auth from "../../../middleware/auth";
import Categories from "../../../models/categoryModels";
import Products from "../../../models/productModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategories(req, res);
      break;
    case "DELETE":
      await deleteCategories(req, res);
      break;
    case "GET":
      await getCategories(req, res);
      break;
  }
};

const getCategories = async (req, res) => {
  try {
    const { id } = req.query;
    let categories;
    categories = await Categories.find({ shop: id });

    res.json({ categories });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateCategories = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { name } = req.body;

    const newCategory = await Categories.findOneAndUpdate(
      { _id: id },
      { name }
    );
    res.json({
      msg: "Successfully Updated a category",
      category: {
        ...newCategory._doc,
        name,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteCategories = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    const products = await Products.findOne({ category: id });
    if (products)
      return res
        .status(400)
        .json({ err: "Please delete all products with a relationship." });

    await Categories.findByIdAndDelete(id);

    res.json({ msg: "Successfully Deleted a category" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
