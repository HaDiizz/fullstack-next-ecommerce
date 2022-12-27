import connectDB from "../../../../utils/connectDB";
import Users from "../../../../models/userModel";
import Token from "../../../../models/tokenModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await verifyEmail(req, res);
      break;
  }
};

const verifyEmail = async (req, res) => {
  try {
    const {id} = req.query;
    const userToken = await Token.findOne({token: id});

    if (userToken) {
      const user = await Users.findById(userToken.userId);
      if (!user) {
        return res.status(400).json({
          err: "ไม่พบผู้ใช้งาน",
        });
      }
      
        user.isVerified = true;
        await user.save();
        await Token.deleteOne({ userId: user._id });
        return res.status(200).json({
            msg: "ยืนยันอีเมลสำเร็จ"
        });


    }
    else {
        return res.status(400).json({
            err: "ไม่พบผู้ใช้งาน",
        });
    }

  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
