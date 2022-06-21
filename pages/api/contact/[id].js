import connectDB from "../../../utils/connectDB";
import Contact from "../../../models/contactModel";
import nodemailer from "nodemailer";
import auth from '../../../middleware/auth'

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getContacts(req, res);
      break;
    case "PUT":
      await updateContacts(req, res);
      break;
  }
};

const getContacts = async (req, res) => {
  try {
    const { id } = req.query;
    const contacts = await Contact.find({ _id: id });

    res.json({
      contacts,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateContacts = async (req, res) => {
  try {
    const result = await auth(req, res);
    if(result.role !== 'admin') return res.status(401).json({ err: 'Unauthorized' })
    const { message, email, author } = req.body;
    const { id } = req.query;
    if(!message) return res.status(400).json({ err: 'กรุณากรอกข้อมูลก่อนส่ง' })
    await Contact.findOneAndUpdate({ _id: id }, { status:true, message });

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
      from: ' "[Service] ข้อความตอบกลับ" <NextEcommerce>',
      to: email,
      subject: "NextEcommerce - ตอบกลับจากระบบ",
      html: `<h1>สวัสดีครับคุณ ${author}</h1>
                      <h4>จากที่คุณได้สอบถาม/แจ้งปัญหาเข้ามา ทางผู้ดูแลระบบได้รับทราบเรียบร้อยแล้ว</h4>        
                      <p>${message}</p>
                      <p>ขอขอบคุณที่ใช้บริการ</p>
                      <p>ทีมงาน NextEcommerce</p>              `,
    };

    transporter.sendMail(newMailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log(info);
        console.log("Verification email is sent: " + info.response);
      }
    });

    res.json({ msg: "ดำเนินการสำเร็จ" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
