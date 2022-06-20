import connectDB from "../../../utils/connectDB";
import Contact from "../../../models/contactModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getContacts(req, res);
      break;
    case "POST":
      await createContacts(req, res);
      break;
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.json({
      status: "success",
      result: contacts.length,
      contacts,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createContacts = async (req, res) => {
  try {
    const { title, email, author, detail, images } = req.body;

    // console.log(req.body);

    if (!title || !email || !detail)
      return res.status(400).json({ err: "กรุณากรอกข้อมูลให้ครบถ้วน" });

    const newContacts = new Contact({
      title: title.toLowerCase(),
      email,
      author: author === "" ? "Anonymous" : author,
      detail,
      images,
      status: false,
      message: "",
    });

    await newContacts.save();

    res.json({ msg: "ดำเนินการสำเร็จ" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
