import connectDB from "../../../../utils/connectDB";
import Product from "../../../../models/productModel";
import auth from "../../../../middleware/auth";
import Shop from "../../../../models/shopModel";
import authShop from "../../../../middleware/shop";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await putProduct(req, res);
      break;
    case "GET":
      await getProduct(req, res);
      break;
  }
};

//Update product
const putProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { title, price, inStock, content, category, images } = req.body;

    if (
      !title ||
      !price ||
      !content ||
      category === "all" ||
      images.length === 0
    )
      return res.status(400).json({ err: "Input can not be blank." });

    const newProduct = await Product.findOneAndUpdate(
      { _id: id },
      {
        title: title.toLowerCase(),
        price,
        inStock,
        content,
        category,
        images,
      }
    );

    res.json({
      msg: "Success! Updated a product",
      product: {
        ...newProduct._doc,
        title,
        price,
        inStock,
        content,
        category,
        images,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    const OwnShop = await authShop(req, res);

    if (result.role !== "seller")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    const product = await Product.findOne({ _id: id, shop: OwnShop.id }); //olds findone
    if (!product) res.status(404).json({ err: "Product does not exits." });

    return res.json({
      product: {
        title: product.title,
        price: product.price,
        inStock: product.inStock,
        content: product.content,
        category: product.category,
        images: product.images,
      },
    });
    // }
  } catch (err) {
    return res.status(500).json({ err: err.message });
    // return ;
  }
};
