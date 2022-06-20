import React, { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { DataContext } from "../../store/GlobalState";
import { Input, Spacer, Textarea, Text } from "@nextui-org/react";
import { imageUploadArr } from "../../utils/imageUpload";
import { postDataContact } from "../../utils/fetchData";
import { useRouter } from "next/router";
import Link from "next/link";

const Contact = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const router = useRouter();

  const initialState = {
    title: "",
    email: "",
    author: "Anonymous",
    detail: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [images, setImages] = useState([]);
  const { title, email, author, detail } = formData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUploadInput = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];

    if (files.length === 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Files does not exist" },
      });

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = "The file size is larger than 1 MB.");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "The file type must be JPEG/PNG.");

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });

    if (err) dispatch({ type: "NOTIFY", payload: { error: err } });

    const imgCount = images.length;
    if (imgCount + newImages.length > 2)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "เลือกไฟล์ภาพได้สูงสุด 2 ไฟล์" },
      });

    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !email || !detail)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await imageUploadArr(imgNewURL);

    let res;
    res = await postDataContact("contact", {
      ...formData,
      images: [...imgOldURL, ...media],
    });
    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });

    if (auth.token) {
      setFormData({
        ...initialState,
        title: "",
        detail: "",
      });
    } else {
      setFormData({
        ...initialState,
        title: "",
        email: "",
        author: "Anonymous",
        detail: "",
      });
    }
    setImages([]);

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  useEffect(() => {
    if (auth.token) {
      setFormData({
        ...formData,
        email: auth.user.email,
        author: auth.user.name,
      });
    }
  }, [auth.token]);

  return (
    <div>
      <Head>
        <title>Contact</title>
      </Head>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>

      <div
        className="text-white h-screen w-full flex flex-wrap justify-center container pt-5"
        style={{ maxWidth: "80%", width: "100%" }}
      >
        <div className="text-center text-secondary flex flex-col items-center justify-center">
          <div className="sticky flex justify-center pb-[3rem]">
            <Text
              h1
              size={20}
              css={{
                color: "White",
                textTransform: "uppercase",
                letterSpacing: "0.5rem",
              }}
              weight="bold"
            >
              Service
            </Text>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-12 pr-5 pl-5">
              <Input
                aria-labelledby="tac"
                autoComplete="on"
                aria-label="title"
                width="100%"
                placeholder="หัวข้อ"
                color="secondary"
                name="title"
                value={title}
                onChange={handleChangeInput}
              />
              <Spacer y={1.5} />
              <Textarea
                aria-labelledby="tac"
                width="100%"
                placeholder="กรอกข้อความ"
                color="secondary"
                name="detail"
                value={detail}
                onChange={handleChangeInput}
              />
              <Spacer y={1.5} />
              <Input
                aria-labelledby="tac"
                autoComplete="on"
                aria-label="author"
                width="100%"
                placeholder="ผู้ส่ง"
                color="secondary"
                name="author"
                value={author}
                onChange={handleChangeInput}
              />
              <Spacer y={1.5} />
              <Input
                aria-labelledby="tac"
                autoComplete="on"
                aria-label="email"
                width="100%"
                placeholder="อีเมล"
                color="secondary"
                name="email"
                disabled={auth.token ? true : false}
                value={email}
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6 col-sm-6 pl-5 pr-5 pt-3">
              <div className="flex w-full items-center justify-center bg-grey-lighter">
                <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-black rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:text-indigo-500">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className="mt-2 text-base leading-normal">
                    เลือกไฟล์
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUploadInput}
                    multiple
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 my-4">
              <div className="row img-up mx-0">
                {images.map((img, index) => (
                  <div className="file_img my-2 pl-2" key={index}>
                    <img
                      src={img.url ? img.url : URL.createObjectURL(img)}
                      alt=""
                      className="img-thumbnail rounded"
                    />
                    <span onClick={() => deleteImage(index)}>X</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sticky pt-3">
            <button
              className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-500"
              onClick={handleSubmit}
            >
              ส่งแบบฟอร์ม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
