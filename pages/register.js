import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { Input, Row, Spacer, Textarea, Checkbox } from "@nextui-org/react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { DataContext } from "../store/GlobalState";
import { postData, getData } from "../utils/fetchData";
import { useRouter } from "next/router";
import Image from "next/image";
import { imageUpload } from "../utils/imageUpload";

const Register = () => {
  const router = useRouter();
  const initialState = {
    shopName: "",
    detail: "",
    location: "",
    contact: "",
    isHalal: false,
    public_key: "",
    secret_key: "",
  };
  const [shopData, setshopData] = useState(initialState);
  const {
    shopName,
    contact,
    detail,
    location,
    public_key,
    secret_key,
    isHalal,
  } = shopData;
  const { state, dispatch } = useContext(DataContext);
  const { auth, shops, locations } = state;
  const [isChecked, setIsChecked] = useState(false);
  const [image, setImage] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [file, setFile] = useState("");
  const [isPendding, setIsPendding] = useState(false);

  useEffect(() => {
    if(auth.user) {
      setshopData({
        ...shopData,
        contact: auth.user.telephone,
    })}
  }, [auth.user]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setshopData({ ...shopData, [name]: value });
    return dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (e.target.files.length !== 0) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
    if (!file) {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Files does not exist" },
      });
    }
    if (file.size > 1024 * 1024) {
      setIsImage(false);
      return dispatch({
        type: "NOTIFY",
        payload: { error: "ขนาดไฟล์ใหญ่เกิน 1MB" },
      });
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setIsImage(false);
      return dispatch({
        type: "NOTIFY",
        payload: { error: "อนุญาตเฉพาะไฟล์ jpeg/png เท่านั้น" },
      });
    }

    setIsImage(true); //set the uploaded state to true
  };


  const handleChangeCheck = () => {
    setIsChecked(!isChecked);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    let media = "";

    if (!file || !shopName || !detail || !location || !contact) {
      dispatch({ type: "NOTIFY", payload: { error: "กรุณากรอกข้อมูลให้ครบ" } });
      return;
    }

    if (file) media = await imageUpload(file);
    const res = await postData(
      "shop",
      {
        shopName,
        contact,
        detail,
        location,
        public_key,
        secret_key,
        isChecked,
        image: media[0]?.url,
      },
      auth.token
    );
    if (res.err) {
      setIsImage(false);
      setIsChecked(false);
      setshopData({
        ...shopData,
        shopName: "",
        detail: "",
        location: "",
        contact: "",
        public_key: "",
        secret_key: "",
        isHalal: false,
      });
      dispatch({ type: "NOTIFY", payload: { error: res.err } });
    }

    setIsImage(false);
    setIsChecked(false);
    setshopData({
      ...shopData,
      shopName: "",
      detail: "",
      location: "",
      contact: "",
      public_key: "",
      secret_key: "",
      isHalal: false,
    });
    setTimeout(() => {
      setIsPendding((isPendding) => !isPendding);
    }, 2000);
    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  if (!auth.user) return null;
  if (auth.user.role === "seller") router.push("/manage");
  if (auth.user.role === "admin") router.push("/admin/shop");

  return (
    <>
      <Head>
        <title>Shop Registration</title>
      </Head>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>

      <div className="text-white profile_page h-screen w-full flex flex-wrap justify-center container">
        {isPendding ||
        (shops &&
          shops[0]?.user.email === auth?.user.email &&
          !shops[0].accepted) ||
        (shops && shops[0]?.user.email === auth?.user.email) ? (
          <div className="text-center text-secondary flex flex-col items-center justify-center pt-5">
            <div
              className="spinner-grow text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <div className="flex justify-center text-center pt-4" style={{ zIndex: "1" }}>
              <h3 className="pt-3">
                <span className="text-green-500">ลงทะเบียนสำเร็จ</span>{" "}
                <span className="text-white">รอผู้ดูแลระบบอนุมัติ</span>
              </h3>
            </div>
          </div>
        ) : (
          <>
            <section className="text-secondary flex flex-col items-center justify-center pt-5">
              <h3
                className="text-center text-uppercase pt-[3rem] pb-5 text-secondary"
                style={{ fontSize: "150%" }}
              >
                Shop Registration
              </h3>
              <form
                className="flex flex-col items-center justify-center pl-[7rem] pr-[3rem]"
                onSubmit={handleSubmit}
              >
                <Input
                  autoComplete="on"
                  aria-label="ชื่อร้าน"
                  width="100%"
                  placeholder="ชื่อร้าน"
                  color="secondary"
                  name="shopName"
                  value={shopName}
                  onChange={handleChangeInput}
                />
                <Spacer y={1} />
                <Input
                  autoComplete="on"
                  aria-label="Promptpay"
                  width="100%"
                  placeholder="Promptpay"
                  color="secondary"
                  name="contact"
                  value={contact}
                  onChange={handleChangeInput}
                />
                <Spacer y={1} />
                <Textarea
                  autoComplete="on"
                  aria-label="รายละเอียดร้าน"
                  cols={70}
                  rows={1}
                  width="100%"
                  className="text-white"
                  color="default"
                  placeholder="รายละเอียดร้าน"
                  name="detail"
                  value={detail}
                  onChange={handleChangeInput}
                />
                {/* <Spacer y={1} /> */}
                <Row justify="left">
                  <span className="mb-2 left-0" style={{ fontSize: "90%" }}>
                    กรุณากรอกสมัครบัญชี Omise ก่อนลงทะเบียนร้านค้า
                    เมื่อสมัครเสร็จแล้วไปที่ตั้งค่า {"->"} key{" "}
                    <a
                      href="https://www.omise.co/th/api-authentication/thailand#public-key"
                      target="_blank"
                      rel="noreferrer"
                    >
                      อ่านรายละเอียด
                    </a>
                  </span>
                </Row>
                <Row justify="space-between">
                  <Input.Password
                    autoComplete="on"
                    aria-label="OMISE PUBLIC KEY"
                    width="90%"
                    placeholder="OMISE PUBLIC KEY"
                    color="secondary"
                    name="public_key"
                    className="mr-2"
                    value={public_key}
                    onChange={handleChangeInput}
                  />
                  <Input.Password
                    autoComplete="on"
                    aria-label="OMISE SECRET KEY"
                    width="90%"
                    placeholder="OMISE SECRET KEY"
                    color="secondary"
                    name="secret_key"
                    className="ml-2"
                    value={secret_key}
                    onChange={handleChangeInput}
                  />
                </Row>
                {/* <Spacer y={1} /> */}
                <Row justify="left">
                  <FormControl
                    sx={{ m: 1, width: "30ch" }}
                    className="text-dark"
                  >
                    <span
                      className="text-secondary"
                      style={{ fontSize: "90%" }}
                    >
                      ตำแหน่งที่ตั้ง
                    </span>
                    <Select
                      className="bg-white scrollable"
                      defaultValue={"rongChangRest"}
                      id="location"
                      style={{ maxHeight: "2.5rem" }}
                      name="location"
                      aria-label="ตำแหน่งที่ตั้ง"
                      value={location}
                      onChange={handleChangeInput}
                    >
                      {
                        locations.map((location, index) => (
                          <MenuItem key={index} value={location._id}>
                            {location.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>

                  <div className="pt-4 pl-5">
                    <Checkbox
                      color="gradient"
                      defaultSelected={isChecked}
                      onChange={handleChangeCheck}
                    >
                      <span className="text-white" style={{ fontSize: "90%" }}>
                        ร้านอาหารอิสลาม
                      </span>
                    </Checkbox>
                  </div>
                </Row>
                <Spacer y={1} />
                <Row justify="left">
                  <label htmlFor="contained-button-file" className="mt-[3rem]">
                    <Input
                      aria-label="รูปภาพร้าน"
                      accept="image/*"
                      id="contained-button-file"
                      multiple
                      type="file"
                      className="d-none"
                      onChange={handleUpload}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      className="mb-3"
                    >
                      อัพโหลดรูปภาพร้านค้า
                    </Button>
                  </label>

                  {isImage && (
                    <div id="file_Img" className="pl-[15rem]">
                      {image && <Image src={image} width={50} height={50} alt="logo" />}
                    </div>
                  )}
                </Row>
                <button
                  className="px-5 py-2 rounded text-white bg-neutral-700 hover:bg-neutral-800"
                  style={{ zIndex: "1" }}
                >
                  Submit
                </button>
              </form>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Register;
