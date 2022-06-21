import connectDB from "../../../utils/connectDB";
import auth from "../../../middleware/auth";
import Locations from "../../../models/locationModel";
import Products from "../../../models/productModel";
import Shops from "../../../models/shopModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateLocations(req, res);
      break;
    case "DELETE":
      await deleteLocations(req, res);
      break;
  }
};

const updateLocations = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { name } = req.body;

    const newLocation = await Locations.findOneAndUpdate({ _id: id }, { name });
    return res.json({
      msg: "อัพเดทข้อมูลสำเร็จ",
      location: {
        ...newLocation._doc,
        name,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteLocations = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    // const shops = await Shops.findOne({location: id})
    // if(shops) return res.status(400).json({err: "Please delete all products with a relationship."})

    await Locations.findByIdAndDelete(id);

    return res.json({ msg: "ลบข้อมูลสำเร็จ" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
