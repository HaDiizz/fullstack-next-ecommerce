import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import validate from "../../../utils/validate";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Token from "../../../models/tokenModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await register(req, res);
      break;
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, cf_password, telephone } = req.body;


    const errMsg = validate(name, email, password, cf_password, telephone);

    if (errMsg) return res.status(400).json({ err: errMsg });

    const user = await Users.findOne({ email: email });

    if (user && user.isVerified === false) {
      const newToken = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await newToken.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      var newMailOptions = {
        from: ' "Verify your email" <NextEcommerce>',
        to: user.email,
        subject: "NextEcommerce - Verify your email",
        html: `<h1>ยินดีต้อนรับสู่ NextEcommerce, คุณ ${user.name}</h1>
                      <h4>กรุณายืนยันอีเมล เพื่อดำเนินการสมัครสมาชิกให้สำเร็จภายใน 1 ชั่วโมงนับจากนี้</h4>        
                      <a href="http://localhost:3000/verify/${newToken.token}">
                          Verify Email
                      </a>
              `,
      };

      transporter.sendMail(newMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info);
          console.log("Verification email is sent: " + info.response);
        }
      });

      if (user.isVerified === false) {
        return res.status(200).json({
          msg: "กรุณายืนยันอีเมลในกล่องข้อความ",
        });
      }
    }

    if (user) return res.status(400).json({ err: "อีเมลนี้ถูกใช้ไปแล้ว" });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new Users({
      name,
      email,
      password: passwordHash,
      cf_password,
      telephone,
    });
    await newUser.save();

    const token = new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await token.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "disssvs@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: ' "Verify your email" <disssvs@gmail.com>',
      to: email,
      subject: "NextEcommerce - Verify your email",
      html: `<h1>ยินดีต้อนรับสู่ NextEcommerce, คุณ ${name}</h1>
                    <h4>กรุณายืนยันอีเมล เพื่อดำเนินการสมัครสมาชิกให้สำเร็จภายใน 1 ชั่วโมงนับจากนี้</h4>        
                    <a href="http://localhost:3000/verify/${token.token}">
                        Verify Email
                    </a>
            `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
        console.log("Verification email is sent: " + info.response);
      }
    });

    if (newUser.isVerified === false) {
      return res.status(200).json({
        msg: "กรุณายืนยันอีเมลในกล่องข้อความ",
      });
    }

    // console.log(newUser)
    return res.json({ msg: "สมัครสมาชิกสำเร็จ" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
