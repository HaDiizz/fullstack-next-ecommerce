import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import auth from "../../../middleware/auth";
import Shop from "../../../models/shopModel";
import CryptoJS from "crypto-js";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await updateRole(req, res);
      // await updateAccept(req, res)
      break;
    case "DELETE":
      await deleteShop(req, res);
      break;
    case "PUT":
      await uploadInfor(req, res);
      break;
    case "GET":
      await getShop(req, res);
      break;
  }
};

const updateRole = async (req, res) => {
  try {
    // console.log(req.body)

    const result = await auth(req, res);
    if (result.role !== "admin" && !result.root)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { role } = req.body;

    await Users.findOneAndUpdate({ _id: id }, { role });
    res.json({ msg: "Updated Succesfully", role });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

// const updateAccept = async (req, res) => {
//     try {
//         const result = await auth(req, res)
//         if(result.role !== 'admin' || !result.root)
//             return res.status(400).json({err: "Authentication is not valid."})

//         const {id} = req.query
//         const {accepted} = req.body

//         await Users.findOneAndUpdate({_id: id}, {accepted})
//         res.json({msg: 'Updated Succesfully'})

//     } catch (err) {
//         return res.status(500).json({err: err.message})
//     }
// }

const deleteShop = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin" || !result.root)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await Shop.findByIdAndDelete(id);
    res.json({ msg: "ลบร้านค้าสำเร็จ" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const uploadInfor = async (req, res) => {
  try {
    // const result = await auth(req, res)
    const { logo, shopName, contact, detail, location, public_key, secret_key } = req.body;
    const { id } = req.query;

    var publicKeyHash = CryptoJS.AES.encrypt(public_key, process.env.CRYPTO_PUBLIC).toString();
    var secretKeyHash = CryptoJS.AES.encrypt(secret_key, process.env.CRYPTO_SECRET).toString();

    const newShop = await Shop.findOneAndUpdate(
      { _id: id },
      { logo, shopName, contact, detail, location, public_key: publicKeyHash, secret_key: secretKeyHash },
    );

    res.json({
      msg: "อัพเดทข้อมูลสำเร็จ",
      shop: {
        ...newShop,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getShop = async (req, res) => {
  try {
    const { id } = req.query;
    const shop = await Shop.findById(id);
    res.json({
      shop,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
