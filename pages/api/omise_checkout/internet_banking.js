import connectDB from "../../../utils/connectDB";
import Order from "../../../models/orderModel";
import {createInternetBanking} from '../../../omiseConfiguration'

connectDB();

// var omise = require("omise")({
//   publicKey: process.env.OMISE_PUBLIC_KEY,
//   secretKey: process.env.OMISE_SECRET_KEY,
// });

// omise();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOmiseIB(req, res);
      break;
  }
};

const createOmiseIB = async (req, res) => {

  const { token, name, email, amount, _id } = req.body;
    console.log(req.body)
  try {

    const charge = await createInternetBanking(amount, token, _id);

    if(!charge) throw new Error('Something went wrong Please try again later');

    console.log(charge.status);

    res.json({
      amount: charge.amount,
      authorizeUri: charge.authorize_uri,
      status: charge.status,
    });

  } catch (error) {
    console.log(error);
  }
};
