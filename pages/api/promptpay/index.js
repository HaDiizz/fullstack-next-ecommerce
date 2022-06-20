import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import connectDB from "../../../utils/connectDB";
import Shop from "../../../models/shopModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createPromptpayQRCode(req, res);
      break;
  }
};

const createPromptpayQRCode = async (req, res) => {
  const { amount, shop } = req.body;
  try {
    const shopData = await Shop.findOne({ _id: shop });
    const tel = shopData.contact;
    const payload = generatePayload(tel, { amount });
    const options = {
      color: {
        dark: "#000",
        light: "#fff",
      },
    };

    QRCode.toDataURL(payload, options, (err, url) => {
      if (err) {
        res.status(500).json({
          message: "Error creating QR code",
          error: err,
        });
      } else {
        res.status(200).json({
          message: "QR code created",
          data: url,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
