import connectDB from "../../../utils/connectDB";
import auth from "../../../middleware/auth";
import Location from "../../../models/locationModel";
import Shop from "../../../models/shopModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createLocations(req, res);
      break;
    case "GET":
      await getLocations(req, res);
      break;
  }
};

const createLocations = async (req, res) => {
  try {
    const result = await auth(req, res);
    if(result.role !== "admin") return res.status(400).json({ err: "Authentication is not valid" });

    const { name } = req.body;

    if (!name)
      res.status(400).json({ err: "Name is empty. Please, input the name." });

    const newLocations = new Location({
      name: name.toLowerCase(),
    });

    await newLocations.save();

    res.json({
      msg: "Successfully! Created a category.",
      newLocations,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getLocations = async (req, res) => {
  try {

    const locations = await Location.find();

    res.json({ locations });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
