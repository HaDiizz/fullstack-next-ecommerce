import connectDB from "../../../utils/connectDB";
import Order from "../../../models/orderModel";
import {createCharge, createCustomer} from '../../../omiseConfiguration'
import Omise from "omise";
import CryptoJS from "crypto-js";

connectDB();


export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOmiseCard(req, res);
      break;
  }
};

const createOmiseCard = async (req, res) => {

  const { token, name, email, amount, secretKeyHash, publicKeyHash, id } = req.body;
  const baseUrl = process.env.BASE_URL

  try {

    let publicKeyDecryp = CryptoJS.AES.decrypt(
      publicKeyHash,
      process.env.CRYPTO_PUBLIC
    );
    let secretKeyDecryp = CryptoJS.AES.decrypt(
      secretKeyHash,
      process.env.CRYPTO_SECRET
    );
    let publicKey = publicKeyDecryp?.toString(CryptoJS.enc.Utf8).toString();
    let secretKey = secretKeyDecryp?.toString(CryptoJS.enc.Utf8).toString();

    const omise = Omise({
      publicKey: publicKey,
      secretKey: secretKey,
    });

    const customer = await createCustomer(email, name, token, omise);
    // console.log(customer.id);
    const charge = await createCharge(amount, customer, omise);

    if(!charge) return res.status(400).json({err: 'ไม่สามารถทำรายการได้ กรุณาลองใหม่อีกครั้ง'})

    await Order.findOneAndUpdate(
      { _id: id },
      {
        dateOfPayment: new Date(),
        method: "OMISE CARD",
        paid: true,
        status: 0,
        paymentId: charge.id,
      }
    );
    // console.log(charge);
    // console.log(customer);

    // console.log(charge);
    res.json({
      chargeId: charge.id,
      amount: charge.amount,
      status: "ชำระเงินสำเร็จ",
    });

  } catch (error) {
    console.log(error);
  }
};
